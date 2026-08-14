import { useState } from 'react'
import { Link, useParams } from 'react-router'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'

import {
  FORMAT_LABELS,
  getReview,
  MAX_CHILD_AGE,
  MIN_CHILD_AGE,
  type ReviewDto,
  type ReviewStatus,
  SERVICE_LABELS,
  type ServiceType,
  type SessionFormat,
  STATUS_LABELS,
  toDateInputValue,
} from '@entities/review'

import { ApiError } from '@shared/api'
import { paths } from '@shared/config'
import { ErrorState } from '@shared/ui/ErrorState'
import { FormActions } from '@shared/ui/FormActions'
import { Loader } from '@shared/ui/Loader'
import { StatusBadge } from '@shared/ui/StatusBadge'
import { useToast } from '@shared/ui/Toast'

import styles from './ReviewPage.module.scss'

interface IReviewForm {
  review: string
  age: string
  service: ServiceType
  format: SessionFormat
  reviewDate: string
  status: ReviewStatus
}

type ReviewFormErrors = Partial<Record<keyof IReviewForm, string>>

const EMPTY_FORM: IReviewForm = {
  review: '',
  age: '',
  service: 'developmental',
  format: 'online',
  reviewDate: toDateInputValue(new Date().toISOString()),
  status: 'draft',
}

const toForm = (review: ReviewDto): IReviewForm => ({
  review: review.review,
  age: String(review.age),
  service: review.service,
  format: review.format,
  reviewDate: toDateInputValue(review.reviewDate),
  status: review.status,
})

const serviceOptions = Object.entries(SERVICE_LABELS) as [ServiceType, string][]
const formatOptions = Object.entries(FORMAT_LABELS) as [SessionFormat, string][]
const statusOptions = Object.entries(STATUS_LABELS) as [ReviewStatus, string][]

const STATUS_SEGMENT_CLASS: Record<ReviewStatus, string> = {
  draft: styles.segmentDraft,
  pending: styles.segmentPending,
  published: styles.segmentPublished,
  rejected: styles.segmentRejected,
}

const validate = ({ review, age, reviewDate }: IReviewForm) => {
  const errors: ReviewFormErrors = {}

  if (!review.trim()) errors.review = 'Заполните текст отзыва'

  const parsedAge = Number(age)
  if (!age.trim() || Number.isNaN(parsedAge)) {
    errors.age = 'Укажите возраст'
  } else if (!Number.isInteger(parsedAge)) {
    errors.age = 'Возраст должен быть целым числом'
  } else if (parsedAge < MIN_CHILD_AGE || parsedAge > MAX_CHILD_AGE) {
    errors.age = `Возраст от ${MIN_CHILD_AGE} до ${MAX_CHILD_AGE} лет`
  }

  if (!reviewDate) errors.reviewDate = 'Укажите дату отзыва'

  return errors
}

const ReviewPage = () => {
  const { id = '' } = useParams()
  const { notify } = useToast()
  const queryClient = useQueryClient()

  const { isLoading, error, data } = useQuery({
    queryKey: ['review', id],
    queryFn: () => getReview(id),
    enabled: Boolean(id),
    select: (response) => response.data,
    // переход из списка — форма рисуется сразу из кэша, запрос идёт фоном
    initialData: () => {
      const cached = queryClient
        .getQueryData<{ data: ReviewDto[] }>(['reviews'])
        ?.data.find((review) => review.id === Number(id))

      return cached && { data: cached }
    },
    // возраст наследуется от списка, иначе react-query сочтёт данные свежими и не сходит на сервер
    initialDataUpdatedAt: () => queryClient.getQueryState(['reviews'])?.dataUpdatedAt,
  })

  const [values, setValues] = useState<IReviewForm>(EMPTY_FORM)
  const [syncedReview, setSyncedReview] = useState<ReviewDto | undefined>()
  const [errors, setErrors] = useState<ReviewFormErrors>({})

  if (data && data !== syncedReview) {
    setSyncedReview(data)
    setValues(toForm(data))
    setErrors({})
  }

  if (isLoading) return <Loader />

  if (error instanceof ApiError && error.status === 404) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <Link className={styles.back} to={paths.reviews}>
            ← К списку отзывов
          </Link>
          <h1 className={styles.title}>Отзыв не найден</h1>
        </header>
        <p className={styles.notFound}>Отзыв #{id} не существует или был удалён.</p>
      </div>
    )
  }

  if (error) return <ErrorState message={error.message} />

  const handleChange = (patch: Partial<IReviewForm>) => {
    setValues((prev) => ({ ...prev, ...patch }))
    setErrors((prev) => {
      const next = { ...prev }
      Object.keys(patch).forEach((field) => delete next[field as keyof IReviewForm])
      return next
    })
  }

  const handleSave = () => {
    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      notify('error', 'Заполните обязательные поля перед сохранением')
      return
    }

    const payload = {
      ...(id ? { id: Number(id) } : {}),
      review: values.review.trim(),
      age: Number(values.age),
      service: values.service,
      format: values.format,
      reviewDate: new Date(values.reviewDate),
      status: values.status,
    }

    // TODO: отправить payload, когда появится PUT /reviews/:id
    console.info('SaveReviewDto', payload)
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link className={styles.back} to={paths.reviews}>
          ← К списку отзывов
        </Link>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Отзыв #{id}</h1>
          {data?.translationStatus && <StatusBadge status={data.translationStatus} />}
        </div>
      </header>

      <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
        <div className={classNames(styles.field, styles.fieldWide)}>
          <label className={styles.label} htmlFor="review">
            Текст отзыва
          </label>
          <textarea
            id="review"
            className={classNames(styles.control, styles.textarea, errors.review && styles.invalid)}
            value={values.review}
            onChange={(event) => handleChange({ review: event.target.value })}
            placeholder="Текст отзыва"
            aria-invalid={Boolean(errors.review) || undefined}
            rows={6}
          />
          {errors.review && <span className={styles.error}>{errors.review}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="age">
            Возраст ребёнка
          </label>
          <input
            id="age"
            type="number"
            inputMode="numeric"
            min={MIN_CHILD_AGE}
            max={MAX_CHILD_AGE}
            className={classNames(styles.control, errors.age && styles.invalid)}
            value={values.age}
            onChange={(event) => handleChange({ age: event.target.value })}
            placeholder={`${MIN_CHILD_AGE}–${MAX_CHILD_AGE}`}
            aria-invalid={Boolean(errors.age) || undefined}
          />
          {errors.age && <span className={styles.error}>{errors.age}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="reviewDate">
            Дата отзыва
          </label>
          <input
            id="reviewDate"
            type="date"
            className={classNames(styles.control, errors.reviewDate && styles.invalid)}
            value={values.reviewDate}
            onChange={(event) => handleChange({ reviewDate: event.target.value })}
            aria-invalid={Boolean(errors.reviewDate) || undefined}
          />
          {errors.reviewDate && <span className={styles.error}>{errors.reviewDate}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="service">
            Услуга
          </label>
          <select
            id="service"
            className={styles.control}
            value={values.service}
            onChange={(event) => handleChange({ service: event.target.value as ServiceType })}
          >
            {serviceOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="format">
            Формат
          </label>
          <select
            id="format"
            className={styles.control}
            value={values.format}
            onChange={(event) => handleChange({ format: event.target.value as SessionFormat })}
          >
            {formatOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className={classNames(styles.field, styles.fieldWide)}>
          <span className={styles.label} id="status-label">
            Статус
          </span>
          <div className={styles.segmented} role="radiogroup" aria-labelledby="status-label">
            {statusOptions.map(([value, label]) => (
              <label
                key={value}
                className={classNames(
                  styles.segment,
                  values.status === value && styles.segmentActive,
                  values.status === value && STATUS_SEGMENT_CLASS[value],
                )}
              >
                <input
                  type="radio"
                  name="status"
                  className={styles.segmentInput}
                  value={value}
                  checked={values.status === value}
                  onChange={() => handleChange({ status: value })}
                />
                <span className={styles.segmentDot} aria-hidden="true" />
                {label}
              </label>
            ))}
          </div>
        </div>

      </form>

      <FormActions onSave={handleSave} />
    </div>
  )
}

export default ReviewPage
