import Link from 'next/link';
import ReviewCard from '../../../components/ReviewCard/ReviewCard';
import Section from '../../../components/Section/Section';
import styles from './page.module.scss';

const reviews = [
  { src: '/images/image.jpg', alt: 'Отзыв 1' }, // замените на /images/reviews/screen-1.jpg
  { src: '/images/image.jpg', alt: 'Отзыв 2' }, // замените на /images/reviews/screen-2.jpg
  { src: '/images/image.jpg', alt: 'Отзыв 3' }, // замените на /images/reviews/screen-3.jpg
  { src: '/images/image.jpg', alt: 'Отзыв 4' }, // замените на /images/reviews/screen-4.jpg
  { src: '/images/image.jpg', alt: 'Отзыв 5' }, // замените на /images/reviews/screen-5.jpg
  { src: '/images/image.jpg', alt: 'Отзыв 6' }, // замените на /images/reviews/screen-6.jpg
];

export default async function ReviewsPage() {
  return (
    <main className={styles.main}>
      <Section
        title="Отзывы"
        lead="Живые скриншоты благодарностей — без имен, только реальный опыт."
      >
        <div className={styles.topBar}>
          <Link href="/reviews/new" className={styles.link}>
            Оставить отзыв
          </Link>
          <p className={styles.hint}>Все отзывы представлены в виде скриншотов.</p>
        </div>

        <ul className={styles.grid}>
          {reviews.map((review, index) => (
            <ReviewCard key={review.alt} src={review.src} alt={review.alt} index={index} />
          ))}
        </ul>
      </Section>
    </main>
  );
}


