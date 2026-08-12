// TODO delete
import type { TranslationStatus } from '@shared/ui/StatusBadge'

export type ServiceType = 'developmental' | 'diagnostics' | 'session' | 'consultation'

export type SessionFormat = 'online' | 'offline'

export type ReviewStatus = 'draft' | 'published'

export interface ReviewDto {
  id: number
  review: string
  age: number
  service: ServiceType
  format: SessionFormat
  reviewDate: string
  status: ReviewStatus
  translationStatus?: TranslationStatus
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  developmental: 'Развивающие занятия',
  diagnostics: 'Диагностика',
  session: 'Занятие',
  consultation: 'Консультация',
}

export const FORMAT_LABELS: Record<SessionFormat, string> = {
  online: 'Онлайн',
  offline: 'Очно',
}

export const STATUS_LABELS: Record<ReviewStatus, string> = {
  draft: 'Черновик',
  published: 'Опубликован',
}
