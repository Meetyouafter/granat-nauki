import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { DeeplService } from './deepl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqTranslationEntity } from 'src/faq/entities/faq.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FaqTranslationEntity])],
  providers: [DeeplService, TranslationService],
})
export class TranslationModule {}
