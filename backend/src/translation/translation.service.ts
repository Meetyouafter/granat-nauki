import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeeplService } from './deepl.service';

@Injectable()
export class TranslationService {
  constructor(private readonly deeplService: DeeplService) {}
  private readonly logger = new Logger(TranslationService.name);
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleTranslate() {
    // const tt = await this.deeplService.sendTextToTranslate(['Привет'], 'en');
    // this.logger.log('Running translation…', tt);
  }
}
