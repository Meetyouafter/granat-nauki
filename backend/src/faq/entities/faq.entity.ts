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
  locale!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @ManyToOne(() => FaqEntity, (faq) => faq.translations, {
    onDelete: 'CASCADE',
  })
  faq!: FaqEntity;
}
