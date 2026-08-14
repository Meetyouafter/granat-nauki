import type { FC } from 'react'
import { useNavigate } from 'react-router'

import classNames from 'classnames'

import { paths } from '@shared/config'
import { StatusBadge } from '@shared/ui/StatusBadge'

import { formatAge } from '../lib/formatAge'
import { formatReviewDate } from '../lib/formatReviewDate'
import { FORMAT_LABELS, type ReviewDto, SERVICE_LABELS, STATUS_LABELS } from '../model/types'

import styles from './ReviewCard.module.scss'

interface IReviewCard {
  review: ReviewDto
}

const ReviewCard: FC<IReviewCard> = ({ review }) => {
  const navigate = useNavigate()
  const handleRedirect = () => navigate(`${paths.reviews}/${review.id}`)

  return (
    <article className={styles.card} onClick={handleRedirect}>
      <header className={styles.header}>
        <time className={styles.date} dateTime={review.reviewDate}>
          {formatReviewDate(review.reviewDate)}
        </time>
        <div className={styles.badges}>
          <span
            className={classNames(
              styles.status,
              review.status === 'published' ? styles.statusPublished : styles.statusDraft,
            )}
          >
            {STATUS_LABELS[review.status]}
          </span>
          {review.translationStatus && <StatusBadge status={review.translationStatus} />}
        </div>
      </header>

      <p className={styles.text}>{review.review}</p>

      <div className={styles.meta}>
        <span className={styles.tag}>{SERVICE_LABELS[review.service]}</span>
        <span className={styles.tag}>{FORMAT_LABELS[review.format]}</span>
        <span className={styles.tag}>{formatAge(review.age)}</span>
        <span className={styles.id}>#{review.id}</span>
      </div>

      <footer className={styles.footer}>
        <button
          type="button"
          className={styles.editButton}
          onClick={handleRedirect} 
        >
          Редактировать
        </button>
      </footer>
    </article>
  )
}

export default ReviewCard
