import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import metadata from '@/data/metadata';
import { routing } from '@/i18n/routing';
import ReviewCard from '@components/ReviewCard/ReviewCard';
import ReviewForm from '@components/ReviewForm/ReviewForm';
import Section from '@components/Section/Section';
import { reviewsData } from '@data/reviewsData';

import styles from './page.module.scss';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? metadata.reviews[locale] : metadata.reviews.en;
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
              key={`${review.src}-${index}`}
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
