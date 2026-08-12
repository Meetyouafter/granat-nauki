import { useQuery } from '@tanstack/react-query'

import { getReviews, ReviewCard } from '@entities/review'

import { ErrorState } from '@shared/ui/ErrorState'
import { Loader } from '@shared/ui/Loader'

import styles from './ReviewsPage.module.scss'

const ReviewsPage = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['reviews'],
    queryFn: getReviews,
    select: (data) => data.data,
  })

  if (isLoading) return <Loader />
  if (error) return <ErrorState message={error.message} />

  const reviews = data ?? []

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Отзывы ({reviews.length})</h1>
      {reviews.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Пока нет ни одного отзыва</p>
        </div>
      ) : (
        <ul className={styles.grid}>
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ReviewsPage
