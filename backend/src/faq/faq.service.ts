import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FaqEntity, FaqTranslationEntity } from './entities/faq.entity';
import { Repository } from 'typeorm';
import { GetFaqDto } from './dto/getFaq.dto';
import { SaveFaqDto } from './dto/saveFaq.dto';
import { LOCALE_EN, LOCALE_RU, TranslationStatus } from '@constants';
import { Locale } from '@interfaces';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(FaqEntity)
    private readonly faqRepository: Repository<FaqEntity>,
  ) {}

  async getFaqItems(
    locale: Locale = LOCALE_RU,
    limit?: number,
  ): Promise<GetFaqDto[]> {
    const query = this.faqRepository
      .createQueryBuilder('faq')
      .orderBy('faq.order', 'ASC');

    if (locale === LOCALE_RU) {
      // ru — показываем всё, включая ещё не переведённое + статус
      query.leftJoinAndSelect('faq.translations', 'translation');
    } else {
      // другие языки — показываем только то, что переведено
      query.innerJoinAndSelect(
        'faq.translations',
        'translation',
        'translation.locale = :locale AND translation.title != :empty AND translation.description != :empty',
        { locale, empty: '' },
      );
    }

    if (limit) query.take(limit);

    const rows = await query.getMany();

    if (locale === LOCALE_RU) {
      return rows.flatMap((faq) => {
        const translation = faq.translations.find(
          (t) => t.locale === LOCALE_RU,
        );

        if (!translation) return [];

        const enTranslation = faq.translations.find(
          (t) => t.locale === LOCALE_EN,
        );

        return [
          {
            id: faq.id,
            title: translation.title,
            description: translation.description,
            translationStatus:
              enTranslation?.status ?? TranslationStatus.PENDING,
          },
        ];
      });
    }

    return rows.flatMap((faq) => {
      const translation = faq.translations.find((t) => t.locale === locale);

      if (!translation) return [];

      return [
        {
          id: faq.id,
          title: translation.title,
          description: translation.description,
        },
      ];
    });
  }

  async deleteFaqItem(
    id: number,
    repo: Repository<FaqEntity> = this.faqRepository,
  ): Promise<void> {
    const result = await repo.delete(id);

    if (result.affected === 0) throw new NotFoundException();
  }

  async createFaqItem(
    faq: SaveFaqDto,
    order: number,
    repo: Repository<FaqEntity> = this.faqRepository,
  ): Promise<FaqEntity> {
    const entity = repo.create({
      translations: [
        { locale: LOCALE_RU, title: faq.title, description: faq.description },
        {
          locale: LOCALE_EN,
          title: '',
          description: '',
          status: TranslationStatus.PENDING,
        },
      ],
      order,
    });

    return repo.save(entity);
  }

  async editFaqItem(
    faq: SaveFaqDto,
    order: number,
    repo: Repository<FaqEntity> = this.faqRepository,
  ): Promise<FaqEntity> {
    if (!faq.id) throw new BadRequestException();

    const entity = await repo.findOne({
      where: { id: faq.id },
      relations: { translations: true },
    });

    if (!entity) throw new NotFoundException();

    entity.order = order;

    const originTranslation = entity.translations.find(
      (t) => t.locale === LOCALE_RU,
    );

    if (!originTranslation) throw new BadRequestException();

    // меняем текст перевода только если текст на РУ изменился
    const textChanged =
      originTranslation.title !== faq.title ||
      originTranslation.description !== faq.description;

    if (textChanged) {
      originTranslation.title = faq.title;
      originTranslation.description = faq.description;

      let enTranslation = entity.translations.find(
        (t) => t.locale === LOCALE_EN,
      );

      if (!enTranslation) {
        enTranslation = new FaqTranslationEntity();
        enTranslation.locale = LOCALE_EN;
        enTranslation.title = '';
        enTranslation.description = '';
        entity.translations.push(enTranslation);
      }

      enTranslation.status = TranslationStatus.PENDING;
      enTranslation.attempts = 0;
      enTranslation.lastError = null;
    }

    return repo.save(entity);
  }

  async saveFaqItems(faqs: SaveFaqDto[]): Promise<GetFaqDto[]> {
    return this.faqRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(FaqEntity);

      const existing = await repo.find({
        relations: { translations: true },
      });

      const toDelete = existing.filter(
        (entity) => !faqs.some((faq) => faq.id === entity.id),
      );

      for (const entity of toDelete) {
        await this.deleteFaqItem(entity.id, repo);
      }

      const saved: FaqEntity[] = [];

      for (const [index, faq] of faqs.entries()) {
        saved.push(
          faq.id
            ? await this.editFaqItem(faq, index, repo)
            : await this.createFaqItem(faq, index, repo),
        );
      }

      return saved.map((entity) => this.toGetFaqDto(entity, LOCALE_RU));
    });
  }

  private toGetFaqDto(entity: FaqEntity, locale: Locale): GetFaqDto {
    const translation = entity.translations.find((t) => t.locale === locale);

    if (!translation) throw new NotFoundException();

    return {
      id: entity.id,
      title: translation.title,
      description: translation.description,
    };
  }
}
