import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeeplService } from './deepl.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FaqTranslationEntity } from 'src/faq/entities/faq.entity';
import { Repository } from 'typeorm';
import {
  LOCALE_EN,
  LOCALE_RU,
  MAX_TRANSLATE_ATTEMPTS_COUNT,
  TranslationStatus,
} from '@constants';

@Injectable()
export class TranslationService {
  constructor(
    private readonly deeplService: DeeplService,
    @InjectRepository(FaqTranslationEntity)
    private readonly translationRepo: Repository<FaqTranslationEntity>,
  ) {}
  private readonly logger = new Logger(TranslationService.name);

  @Cron(CronExpression.EVERY_HOUR)
  async handleTranslate() {
    const pending = await this.translationRepo.find({
      where: { status: TranslationStatus.PENDING, locale: LOCALE_EN },
      relations: { faq: { translations: true } },
      take: 5,
    });

    for (const translation of pending) {
      const ru = translation.faq.translations.find(
        (t) => t.locale === LOCALE_RU,
      );

      if (!ru) continue;

      try {
        const [title, description] =
          await this.deeplService.sendTextToTranslate(
            [ru?.title, ru?.description],
            LOCALE_EN,
          );
        translation.title = title;
        translation.description = description;
        translation.status = TranslationStatus.DONE;
        translation.attempts = 0;
        translation.lastError = null;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Translation error';
        translation.attempts++;
        translation.lastError = errorMessage;
        this.logger.log('Translation error', translation.id, errorMessage);
        translation.status =
          translation.attempts >= MAX_TRANSLATE_ATTEMPTS_COUNT
            ? TranslationStatus.FAILED
            : TranslationStatus.PENDING;
      }

      await this.translationRepo.save(translation);
    }
  }
}
