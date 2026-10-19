import type { FC } from 'react';
import { useNavigate } from 'react-router';

import { paths } from '@shared/config';
import { Badge, type BadgeTone } from '@shared/ui/Badge';
import { Button } from '@shared/ui/Button';
import { StatusBadge } from '@shared/ui/StatusBadge';

import { formatAge } from '../lib/formatAge';
import { formatReviewDate } from '../lib/formatReviewDate';
import {
  FORMAT_LABELS,
  type ReviewDto,
  type ReviewStatus,
  SERVICE_LABELS,
  STATUS_LABELS,
} from '../model/types';

import styles from './ReviewCard.module.scss';

const STATUS_TONE: Record<ReviewStatus, BadgeTone> = {
  draft: 'pending',
  pending: 'processing',
  published: 'success',
  rejected: 'error',
};

interface IReviewCard {
  review: ReviewDto;
}

const ReviewCard: FC<IReviewCard> = ({ review }) => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    void navigate(`${paths.reviews}/${review.id}`);
  };

  return (
    <article className={styles.card} onClick={handleRedirect}>
      <header className={styles.header}>
        <time className={styles.date} dateTime={review.reviewDate}>
          {formatReviewDate(review.reviewDate)}
        </time>
        <div className={styles.badges}>
          <Badge tone={STATUS_TONE[review.status]}>
            {STATUS_LABELS[review.status]}
          </Badge>
          {review.translationStatus && <StatusBadge status={review.translationStatus} />}
        </div>
      </header>

      <p className={styles.text}>{review.review}</p>

      <div className={styles.meta}>
        <Badge>{SERVICE_LABELS[review.service]}</Badge>
        <Badge>{FORMAT_LABELS[review.format]}</Badge>
        <Badge>{formatAge(review.age)}</Badge>
        <span className={styles.id}>
          #
          {review.id}
        </span>
      </div>

      <footer className={styles.footer}>
        <Button variant="secondary" size="sm" onClick={handleRedirect}>
          Редактировать
        </Button>
      </footer>
    </article>
  );
};

export default ReviewCard;
