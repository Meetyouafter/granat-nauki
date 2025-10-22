import Section from '../../components/Section/Section';
import Container from '../../components/Container/Container';
import styles from './page.module.scss';
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('HomePage');

  return (
    <main>
      <h1>{t('title')}</h1>
      <Section
        id="hero"
        title={t('hero.title')}
        lead={t('hero.lead')}
      >
        <Container>
          <div className={styles.heroActions}>
            <a href="/contacts" className={styles.ctaPrimary}>{t('hero.ctaPrimary')}</a>
            <a href="/about" className={styles.ctaSecondary}>{t('hero.ctaSecondary')}</a>
          </div>
        </Container>
      </Section>

      <Section id="services" title={t('services.title')} lead={t('services.lead')}>
        <ul className={styles.cardsGridSm}>
          {t.raw('services.items').map((item: string, index: number) => (
            <li key={index} className={styles.card}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="reviews" title={t('reviews.title')} lead={t('reviews.lead')}>
        <ul className={styles.cardsGridMd}>
          {t.raw('reviews.items').map((item: string, index: number) => (
            <li key={index} className={styles.card}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section id="articles" title={t('articles.title')} lead={t('articles.lead')}>
        <ul className={styles.cardsGridMd}>
          {t.raw('articles.items').map((item: string, index: number) => (
            <li key={index} className={styles.card}>{item}</li>
          ))}
        </ul>
      </Section>
    </main>
  );
}


