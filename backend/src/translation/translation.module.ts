import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { DeeplService } from './deepl.service';

@Module({
  providers: [DeeplService, TranslationService],
})
export class TranslationModule {}
