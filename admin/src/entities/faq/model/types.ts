import type { ApiSchemas } from '@shared/api'

export type FaqItemDto = ApiSchemas['GetFaqDto']

/** Ещё не сохранённый вопрос — вместо id у него временный fakeId. */
export interface NewFaqItemDto extends Omit<FaqItemDto, 'id'> {
  fakeId: number
}

export type FaqItem = FaqItemDto | NewFaqItemDto
