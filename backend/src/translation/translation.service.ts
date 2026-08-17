import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeeplService } from './deepl.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FaqTranslationEntity } from '@faq/entities/faq-translation.entity';
import { Repository } from 'typeorm';
import {
  LOCALE_EN,
  LOCALE_RU,
  MAX_TRANSLATE_ATTEMPTS_COUNT,
  TranslationStatus,
} from '@constants';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  constructor(
    private readonly deeplService: DeeplService,
    @InjectRepository(FaqTranslationEntity)
    private readonly translationRepo: Repository<FaqTranslationEntity>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleTranslate(): Promise<void> {
    const pending = await this.translationRepo.find({
      where: { status: TranslationStatus.PENDING, locale: LOCALE_EN },
      relations: { faq: { translations: true } },
      take: 5,
    });

    for (const translation of pending) {
      try {
        const origin = translation.faq.translations.find(
          (t) => t.locale === LOCALE_RU,
        );

        if (!origin) {
          throw new Error(`нет оригинала на "${LOCALE_RU}"`);
        }

        const [question, answer] = await this.deeplService.sendTextToTranslate(
          [origin.question, origin.answer],
          LOCALE_EN,
        );

        translation.question = question;
        translation.answer = answer;
        translation.status = TranslationStatus.DONE;
        translation.attempts = 0;
        translation.lastError = null;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Translation error';

        translation.attempts++;
        translation.lastError = errorMessage;
        translation.status =
          translation.attempts >= MAX_TRANSLATE_ATTEMPTS_COUNT
            ? TranslationStatus.FAILED
            : TranslationStatus.PENDING;

        this.logger.error(
          `Перевод ${translation.id}, попытка ${translation.attempts}: ${errorMessage}`,
        );
      }

      try {
        await this.translationRepo.save(translation);
      } catch (error) {
        this.logger.error(
          `Перевод ${translation.id}: не удалось сохранить результат`,
          error instanceof Error ? error.stack : String(error),
        );
      }
    }
  }
}
