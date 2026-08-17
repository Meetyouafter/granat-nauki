import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FaqItemEntity } from './entities/faq-item.entity';
import { FaqTranslationEntity } from './entities/faq-translation.entity';
import { Repository } from 'typeorm';
import { FaqItemDto } from './dto/faq-item.dto';
import { SaveFaqItemDto } from './dto/save-faq-item.dto';
import {
  LOCALE_EN,
  LOCALE_RU,
  TranslationStatus,
  type Locale,
} from '@constants';

@Injectable()
export class FaqService {
  private readonly logger = new Logger(FaqService.name);

  constructor(
    @InjectRepository(FaqItemEntity)
    private readonly faqRepository: Repository<FaqItemEntity>,
  ) {}

  async findAll(
    locale: Locale = LOCALE_RU,
    limit?: number,
  ): Promise<FaqItemDto[]> {
    const query = this.faqRepository
      .createQueryBuilder('faq')
      .orderBy('faq.sortOrder', 'ASC');

    if (locale === LOCALE_RU) {
      // ru — оригинал, показываем всё. Тянем все переводы, чтобы отдать статус перевода
      query.leftJoinAndSelect('faq.translations', 'translation');
    } else {
      // Остальные языки — только то, что переведено хотя бы раз.
      // Текст при этом может быть устаревшим: после правки оригинала статус
      // сбрасывается в PENDING, но старый перевод продолжает показываться до следующего прогона крона
      query.innerJoinAndSelect(
        'faq.translations',
        'translation',
        'translation.locale = :locale AND translation.question != :empty AND translation.answer != :empty',
        { locale, empty: '' },
      );
    }

    if (limit) query.take(limit);

    const faqItems = await query.getMany();

    return faqItems.flatMap((faqItem) => {
      if (!this.findTranslation(faqItem, locale)) {
        this.logger.warn(
          `FAQ-элемент ${faqItem.id}: нет перевода "${locale}", пропущен в выдаче`,
        );

        return [];
      }

      return [this.toDto(faqItem, locale)];
    });
  }

  async remove(
    id: number,
    repo: Repository<FaqItemEntity> = this.faqRepository,
  ): Promise<void> {
    const result = await repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`FAQ-элемент ${id} не найден`);
    }
  }

  async create(
    faqItem: SaveFaqItemDto,
    sortOrder: number,
    repo: Repository<FaqItemEntity> = this.faqRepository,
  ): Promise<FaqItemEntity> {
    const entity = repo.create({
      translations: [
        {
          locale: LOCALE_RU,
          question: faqItem.question,
          answer: faqItem.answer,
        },
        {
          locale: LOCALE_EN,
          question: '',
          answer: '',
          status: TranslationStatus.PENDING,
        },
      ],
      sortOrder,
    });

    return repo.save(entity);
  }

  async update(
    entity: FaqItemEntity,
    faqItem: SaveFaqItemDto,
    sortOrder: number,
    repo: Repository<FaqItemEntity> = this.faqRepository,
  ): Promise<FaqItemEntity> {
    entity.sortOrder = sortOrder;

    const origin = this.findTranslation(entity, LOCALE_RU);

    if (!origin) {
      throw new InternalServerErrorException(
        `FAQ-элемент ${entity.id}: нет оригинала на "${LOCALE_RU}"`,
      );
    }

    // меняем текст перевода только если текст на РУ изменился
    const textChanged =
      origin.question !== faqItem.question || origin.answer !== faqItem.answer;

    if (textChanged) {
      origin.question = faqItem.question;
      origin.answer = faqItem.answer;

      let translated = this.findTranslation(entity, LOCALE_EN);

      if (!translated) {
        translated = new FaqTranslationEntity();
        translated.locale = LOCALE_EN;
        translated.question = '';
        translated.answer = '';
        entity.translations.push(translated);
      }

      translated.status = TranslationStatus.PENDING;
      translated.attempts = 0;
      translated.lastError = null;
    }

    return repo.save(entity);
  }

  /**
   * Полная замена списка: элементы, которых нет во входных данных, удаляются.
   * Порядок в выдаче задаётся порядком элементов в массиве.
   */
  async saveAll(faqItems: SaveFaqItemDto[]): Promise<FaqItemDto[]> {
    this.assertUniqueIds(faqItems);

    return this.faqRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(FaqItemEntity);

      const existing = await repo.find({ relations: { translations: true } });
      const existingById = new Map(
        existing.map((entity) => [entity.id, entity]),
      );

      const toDelete = existing.filter(
        (entity) => !faqItems.some((faqItem) => faqItem.id === entity.id),
      );

      for (const entity of toDelete) {
        await this.remove(entity.id, repo);
      }

      const saved: FaqItemEntity[] = [];

      for (const [index, faqItem] of faqItems.entries()) {
        if (!faqItem.id) {
          saved.push(await this.create(faqItem, index, repo));
          continue;
        }

        const entity = existingById.get(faqItem.id);

        if (!entity) {
          throw new NotFoundException(`FAQ-элемент ${faqItem.id} не найден`);
        }

        saved.push(await this.update(entity, faqItem, index, repo));
      }

      return saved.map((entity) => this.toDto(entity, LOCALE_RU));
    });
  }

  /**
   * Дубликат id означает, что один и тот же элемент правится дважды:
   */
  private assertUniqueIds(faqItems: SaveFaqItemDto[]): void {
    const ids = faqItems
      .map((faqItem) => faqItem.id)
      .filter((id): id is number => id !== undefined);

    const duplicates = new Set(
      ids.filter((id, index) => ids.indexOf(id) !== index),
    );

    if (duplicates.size) {
      throw new BadRequestException(
        `Повторяющиеся id в списке: ${[...duplicates].join(', ')}`,
      );
    }
  }

  private findTranslation(
    entity: FaqItemEntity,
    locale: Locale,
  ): FaqTranslationEntity | undefined {
    return entity.translations.find(
      (translation) => translation.locale === locale,
    );
  }

  private toDto(entity: FaqItemEntity, locale: Locale): FaqItemDto {
    const localized = this.findTranslation(entity, locale);

    // Не 404: элемент найден, сломан инвариант данных на нашей стороне
    if (!localized) {
      throw new InternalServerErrorException(
        `FAQ-элемент ${entity.id}: нет перевода "${locale}"`,
      );
    }

    const dto: FaqItemDto = {
      id: entity.id,
      question: localized.question,
      answer: localized.answer,
    };

    // Статус перевода нужен админке, которая всегда работает с оригиналом
    if (locale === LOCALE_RU) {
      dto.translationStatus =
        this.findTranslation(entity, LOCALE_EN)?.status ??
        TranslationStatus.PENDING;
    }

    return dto;
  }
}
