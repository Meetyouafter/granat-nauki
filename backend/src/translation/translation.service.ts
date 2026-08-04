import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);
  @Cron(CronExpression.EVERY_10_SECONDS)
  handleTranslate() {
    this.logger.log('Running translation…');
  }
}
