import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqItemEntity } from './entities/faq-item.entity';
import { FaqTranslationEntity } from './entities/faq-translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FaqItemEntity, FaqTranslationEntity])],
  controllers: [FaqController],
  providers: [FaqService],
  exports: [TypeOrmModule],
})
export class FaqModule {}
