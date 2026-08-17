import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FaqTranslationEntity } from './faq-translation.entity';

@Entity({ name: 'faq' })
export class FaqItemEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ default: 0 })
  sortOrder!: number;

  @OneToMany(() => FaqTranslationEntity, (translation) => translation.faq, {
    cascade: true,
  })
  translations!: FaqTranslationEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
