import type { TranslationStatus } from '@shared/ui/StatusBadge';

export interface FaqItemDto {
  id: number;
  title: string;
  description: string;
  translationStatus?: TranslationStatus | undefined;
}

/** Ещё не сохранённый вопрос — вместо id у него временный fakeId. */
export interface NewFaqItemDto extends Omit<FaqItemDto, 'id'> {
  fakeId: number;
}

export type FaqItem = FaqItemDto | NewFaqItemDto;
