import { ReviewCard, type ReviewDto } from '@entities/review';

import { EmptyState } from '@shared/ui/EmptyState';
import { ErrorState } from '@shared/ui/ErrorState';
import { Loader } from '@shared/ui/Loader';
import { PageHeader } from '@shared/ui/PageHeader';

import styles from './ReviewsPage.module.scss';

const ReviewsPage = () => {
  // TODO: заменить на запрос отзывов, когда появится API отзывов
  const isLoading = false as boolean;
  const error = null as Error | null;
  const data = [] as ReviewDto[];

  if (isLoading) return <Loader />;
  if (error) return <ErrorState message={error.message} />;

  const reviews = data;

  return (
    <div className={styles.wrapper}>
      <PageHeader title="Отзывы" count={reviews.length} />
      {reviews.length === 0
        ? (
            <EmptyState text="Пока нет ни одного отзыва" />
          )
        : (
            <ul className={styles.grid}>
              {reviews.map(review => (
                <li key={review.id}>
                  <ReviewCard review={review} />
                </li>
              ))}
            </ul>
          )}
    </div>
  );
};

export default ReviewsPage;
