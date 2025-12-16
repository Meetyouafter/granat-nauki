import Image from 'next/image';
import Link from 'next/link';
import Section from '../../components/Section/Section';
import styles from './page.module.scss';
import { getTranslations } from 'next-intl/server';

const HomePage = async () => {
  const t = await getTranslations('HomePage');

  const serviceIcons = ['💙', '🤝', '🧘', '🆘'];
  const reviewIcons = ['⭐', '💫', '✨'];

  return (
    <main className={styles.root}>
      <Section id="hero">
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
            <p className={styles.heroLead}>{t('hero.lead')}</p>
            <div className={styles.heroActions}>
              <Link href="/contacts" className={styles.ctaPrimary}>
                {t('hero.ctaPrimary')}
                <span className={styles.ctaArrow}>→</span>
              </Link>
              <Link href="/about" className={styles.ctaSecondary}>
                {t('hero.ctaSecondary')}
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <Image
              src="/images/image.jpg"
              alt={t('hero.title')}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className={styles.image}
            />
          </div>
        </div>
      </Section>

      <Section id="services" title={t('services.title')} lead={t('services.lead')}>
        <ul className={styles.servicesGrid}>
          {t.raw('services.items').map((item: string, index: number) => (
            <li key={index} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>{serviceIcons[index] || '💙'}</div>
              <h3 className={styles.serviceTitle}>{item}</h3>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="reviews" title={t('reviews.title')} lead={t('reviews.lead')}>
        <ul className={styles.reviewsGrid}>
          {t.raw('reviews.items').map((item: string, index: number) => (
            <li key={index} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewIcon}>{reviewIcons[index] || '⭐'}</span>
                <span className={styles.reviewQuote}>&ldquo;</span>
              </div>
              <p className={styles.reviewText}>{item}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="articles" title={t('articles.title')} lead={t('articles.lead')}>
        <ul className={styles.articlesGrid}>
          {t.raw('articles.items').map((item: string, index: number) => (
            <li key={index} className={styles.articleCard}>
              <div className={styles.articleIcon}>📝</div>
              <h3 className={styles.articleTitle}>{item}</h3>
              <div className={styles.articleLink}>
                <span>Читать</span>
                <span className={styles.articleArrow}>→</span>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
};

export default HomePage;
