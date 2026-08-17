import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { DeeplService } from './deepl.service';
import { FaqModule } from '@faq/faq.module';

@Module({
  imports: [FaqModule],
  providers: [DeeplService, TranslationService],
})
export class TranslationModule {}
