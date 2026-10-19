import { useState } from 'react';
import { useParams } from 'react-router';

import classNames from 'classnames';

import {
  FORMAT_LABELS,
  MAX_CHILD_AGE,
  MIN_CHILD_AGE,
  type ReviewDto,
  type ReviewStatus,
  SERVICE_LABELS,
  type ServiceType,
  type SessionFormat,
  STATUS_LABELS,
  toDateInputValue,
} from '@entities/review';

import { paths } from '@shared/config';
import { Field, Input, Select, Textarea } from '@shared/ui/Field';
import { FormActions } from '@shared/ui/FormActions';
import { Loader } from '@shared/ui/Loader';
import { PageHeader } from '@shared/ui/PageHeader';
import { StatusBadge } from '@shared/ui/StatusBadge';
import { useToast } from '@shared/ui/Toast';

import styles from './ReviewPage.module.scss';

interface IReviewForm {
  review: string;
  age: string;
  service: ServiceType;
  format: SessionFormat;
  reviewDate: string;
  status: ReviewStatus;
}

type ReviewFormErrors = { [K in keyof IReviewForm]?: string | undefined };

const EMPTY_FORM: IReviewForm = {
  review: '',
  age: '',
  service: 'developmental',
  format: 'online',
  reviewDate: toDateInputValue(new Date().toISOString()),
  status: 'draft',
};

const toForm = (review: ReviewDto): IReviewForm => ({
  review: review.review,
  age: String(review.age),
  service: review.service,
  format: review.format,
  reviewDate: toDateInputValue(review.reviewDate),
  status: review.status,
});

const serviceOptions = Object.entries(SERVICE_LABELS) as [ServiceType, string][];
const formatOptions = Object.entries(FORMAT_LABELS) as [SessionFormat, string][];
const statusOptions = Object.entries(STATUS_LABELS) as [ReviewStatus, string][];

const STATUS_SEGMENT_CLASS: Record<ReviewStatus, string | undefined> = {
  draft: styles.segmentDraft,
  pending: styles.segmentPending,
  published: styles.segmentPublished,
  rejected: styles.segmentRejected,
};

const validate = ({ review, age, reviewDate }: IReviewForm) => {
  const errors: ReviewFormErrors = {};

  if (!review.trim()) errors.review = 'Заполните текст отзыва';

  const parsedAge = Number(age);
  if (!age.trim() || Number.isNaN(parsedAge)) {
    errors.age = 'Укажите возраст';
  } else if (!Number.isInteger(parsedAge)) {
    errors.age = 'Возраст должен быть целым числом';
  } else if (parsedAge < MIN_CHILD_AGE || parsedAge > MAX_CHILD_AGE) {
    errors.age = `Возраст от ${MIN_CHILD_AGE} до ${MAX_CHILD_AGE} лет`;
  }

  if (!reviewDate) errors.reviewDate = 'Укажите дату отзыва';

  return errors;
};

const ReviewPage = () => {
  const { id = '' } = useParams();
  const { notify } = useToast();

  const isLoading = false as boolean;
  // const error: null = null
  // TODO: заменить на запрос отзыва, когда появится API отзывов
  const data = undefined as ReviewDto | undefined;

  const [values, setValues] = useState<IReviewForm>(EMPTY_FORM);
  const [syncedReview, setSyncedReview] = useState<ReviewDto | undefined>();
  const [errors, setErrors] = useState<ReviewFormErrors>({});

  if (data && data !== syncedReview) {
    setSyncedReview(data);
    setValues(toForm(data));
    setErrors({});
  }

  if (isLoading) return <Loader />;

  // if (error instanceof ApiError && error.status === 404) {
  //   return (
  //     <div className={styles.wrapper}>
  //       <PageHeader
  //         title="Отзыв не найден"
  //         back={{ to: paths.reviews, label: 'К списку отзывов' }}
  //       />
  //       <EmptyState text={`Отзыв #${id} не существует или был удалён.`} />
  //     </div>
  //   )
  // }

  // if (error) return <ErrorState message={error.message} />

  const handleChange = (patch: Partial<IReviewForm>) => {
    setValues(prev => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const field of Object.keys(patch) as (keyof IReviewForm)[]) {
        next[field] = undefined;
      }
      return next;
    });
  };

  const handleSave = () => {
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      notify('error', 'Заполните обязательные поля перед сохранением');
      return;
    }

    const payload = {
      ...(id ? { id: Number(id) } : {}),
      review: values.review.trim(),
      age: Number(values.age),
      service: values.service,
      format: values.format,
      reviewDate: new Date(values.reviewDate),
      status: values.status,
    };

    // TODO: отправить payload, когда появится PUT /reviews/:id
    console.info('SaveReviewDto', payload);
  };

  return (
    <div className={styles.wrapper}>
      <PageHeader
        title={`Отзыв #${id}`}
        back={{ to: paths.reviews, label: 'К списку отзывов' }}
        extra={data?.translationStatus && <StatusBadge status={data.translationStatus} />}
      />

      <form className={styles.form} onSubmit={(event) => { event.preventDefault(); }}>
        <Field id="review" label="Текст отзыва" error={errors.review} className={styles.fieldWide}>
          <Textarea
            id="review"
            value={values.review}
            onChange={(event) => { handleChange({ review: event.target.value }); }}
            placeholder="Текст отзыва"
            isInvalid={Boolean(errors.review)}
            rows={6}
          />
        </Field>

        <Field id="age" label="Возраст ребёнка" error={errors.age}>
          <Input
            id="age"
            type="number"
            inputMode="numeric"
            min={MIN_CHILD_AGE}
            max={MAX_CHILD_AGE}
            value={values.age}
            onChange={(event) => { handleChange({ age: event.target.value }); }}
            placeholder={`${MIN_CHILD_AGE}–${MAX_CHILD_AGE}`}
            isInvalid={Boolean(errors.age)}
          />
        </Field>

        <Field id="reviewDate" label="Дата отзыва" error={errors.reviewDate}>
          <Input
            id="reviewDate"
            type="date"
            value={values.reviewDate}
            onChange={(event) => { handleChange({ reviewDate: event.target.value }); }}
            isInvalid={Boolean(errors.reviewDate)}
          />
        </Field>

        <Field id="service" label="Услуга">
          <Select
            id="service"
            value={values.service}
            onChange={(event) => { handleChange({ service: event.target.value as ServiceType }); }}
          >
            {serviceOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>

        <Field id="format" label="Формат">
          <Select
            id="format"
            value={values.format}
            onChange={(event) => { handleChange({ format: event.target.value as SessionFormat }); }}
          >
            {formatOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>

        <div className={classNames(styles.status, styles.fieldWide)}>
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
                  onChange={() => { handleChange({ status: value }); }}
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
  );
};

export default ReviewPage;
