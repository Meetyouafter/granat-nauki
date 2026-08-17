import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { TranslationStatus, type Locale } from '@constants';
import { FaqItemEntity } from './faq-item.entity';

@Entity({ name: 'faq_translations' })
@Unique(['faq', 'locale'])
@Index(['locale', 'status'])
export class FaqTranslationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  locale!: Locale;

  @Column()
  question!: string;

  @Column()
  answer!: string;

  @Column({ default: 0 })
  attempts!: number;

  @Column({ type: 'text', nullable: true, default: null })
  lastError!: null | string;

  @Column({
    type: 'enum',
    enum: TranslationStatus,
    default: TranslationStatus.DONE,
  })
  status!: TranslationStatus;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => FaqItemEntity, (faq) => faq.translations, {
    onDelete: 'CASCADE',
  })
  faq!: FaqItemEntity;
}
