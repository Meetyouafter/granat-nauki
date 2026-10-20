import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import metadata from '@/data/metadata';
import { routing } from '@/i18n/routing';
import PomegranateMark from '@components/PomegranateMark/PomegranateMark';
import Section from '@components/Section/Section';
import Text from '@ui/Text/Text';

import styles from './page.module.scss';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? metadata.about[locale] : metadata.about.en;
}

const QUALIFICATIONS = ['education', 'supervision', 'training'] as const;
const APPROACHES = ['humanistic', 'cbt'] as const;
const HELP_AREAS = ['anxiety', 'communication', 'adaptation', 'selfEsteem'] as const;

const AboutPage = async () => {
  const t = await getTranslations('AboutPage');

  return (
    <main>
      <Section>
        <div className={styles.hero}>
          <div className={styles.heroImage}>
            <Image
              src="/images/image.jpg"
              alt={t('imageAlt')}
              fill
              priority
              sizes="(max-width: 768px) 300px, 400px"
              className={styles.image}
            />
          </div>
          <div className={styles.heroContent}>
            <Text as="h1" size="xl" weight="semibold" italic className={styles.title}>
              {t('title')}
            </Text>
            <Text as="p" size="md" className={styles.subtitle}>
              {t('subtitle')}
            </Text>
            <div className={styles.experience}>
              <span className={styles.experienceNumber}>15+</span>
              <Text as="span" size="sm" weight="semibold" className={styles.experienceText}>
                {t('experience')}
              </Text>
            </div>
          </div>
        </div>
      </Section>

      <Section title={t('about.title')}>
        <div className={styles.prose}>
          <Text as="p">{t('about.description')}</Text>
          <Text as="p">{t('about.help')}</Text>
        </div>
      </Section>

      <Section title={t('approaches.title')}>
        <ul className={styles.tags}>
          {APPROACHES.map(key => (
            <li key={key} className={styles.tag}>{t(`approaches.${key}`)}</li>
          ))}
        </ul>
      </Section>

      <Section title={t('helpAreas.title')}>
        <ul className={styles.helpAreas}>
          {HELP_AREAS.map(key => (
            <li key={key} className={styles.helpArea}>
              <PomegranateMark variant="seed" className={styles.helpIcon} />
              <Text as="span" weight="semibold">{t(`helpAreas.${key}`)}</Text>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t('qualifications.title')}>
        <ul className={styles.qualifications}>
          {QUALIFICATIONS.map(key => (
            <li key={key} className={styles.qualification}>
              <Text as="h3" size="md" weight="semibold" italic className={styles.qualificationTitle}>
                {t(`qualifications.${key}.title`)}
              </Text>
              <Text as="p" size="xs" className={styles.qualificationText}>
                {t(`qualifications.${key}.description`)}
              </Text>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
};

export default AboutPage;
