import ReviewCard from '../../../components/ReviewCard/ReviewCard';
import Section from '../../../components/Section/Section';
import ReviewForm from '../../../components/ReviewForm/ReviewForm';
import styles from './page.module.scss';
import { reviewsData } from '../../../data/reviewsData';
import metadata from '@/data/metadata';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return metadata.reviews[params.locale as keyof typeof metadata.reviews] ?? metadata.reviews.en;
}

const ReviewsPage = () => {
  return (
    <main className={styles.main}>
      <Section
        title="Отзывы"
        lead="Живые скриншоты благодарностей — без имен, только реальный опыт."
      >
        <div className={styles.topBar}>
          <ReviewForm />
          <p className={styles.hint}>Все отзывы представлены в виде скриншотов.</p>
        </div>

        <ul className={styles.grid}>
          {reviewsData.map((review, index) => (
            <ReviewCard key={review.alt} src={review.src} alt={review.alt} index={index} />
          ))}
        </ul>
      </Section>
    </main>
  );
};

export default ReviewsPage;
