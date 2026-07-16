import { getTranslations } from 'next-intl/server';
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
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  return metadata.reviews[locale as keyof typeof metadata.reviews] ?? metadata.reviews.en;
}

const ReviewsPage = async () => {
  const t = await getTranslations('ReviewsPage');

  return (
    <main className={styles.main}>
      <Section title={t('title')} lead={t('lead')}>
        <div className={styles.topBar}>
          <ReviewForm />
          <p className={styles.hint}>{t('hint')}</p>
        </div>

        <ul className={styles.grid}>
          {reviewsData.map((review, index) => (
            <ReviewCard
              key={review.src + index}
              src={review.src}
              alt={t('reviewAlt', { number: index + 1 })}
              index={index}
            />
          ))}
        </ul>
      </Section>
    </main>
  );
};

export default ReviewsPage;
