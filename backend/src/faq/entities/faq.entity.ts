import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { TranslationStatus } from './translation-status.enum';
import type { Locale } from '@interfaces';

@Entity({ name: 'faq' })
export class FaqEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 0 })
  order!: number;

  @OneToMany(() => FaqTranslationEntity, (translation) => translation.faq, {
    cascade: true,
  })
  translations!: FaqTranslationEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity({ name: 'faq_translations' })
@Unique(['faq', 'locale'])
export class FaqTranslationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  locale!: Locale;

  @Column()
  title!: string;

  @Column()
  description!: string;

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

  @ManyToOne(() => FaqEntity, (faq) => faq.translations, {
    onDelete: 'CASCADE',
  })
  faq!: FaqEntity;
}
