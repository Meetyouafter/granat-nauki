import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Section from '../../../components/Section/Section';
import styles from './page.module.scss';
import { Metadata } from 'next';
import metadata from '@/data/metadata';

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return metadata.about[params.locale as keyof typeof metadata.about] ?? metadata.about.en;
}

const AboutPage = async () => {
  const t = await getTranslations('AboutPage');

  const qualifications = [
    {
      icon: '🎓',
      title: t('qualifications.education.title'),
      description: t('qualifications.education.description'),
    },
    {
      icon: '💼',
      title: t('qualifications.supervision.title'),
      description: t('qualifications.supervision.description'),
    },
    {
      icon: '📚',
      title: t('qualifications.training.title'),
      description: t('qualifications.training.description'),
    },
  ];

  const approaches = [
    t('approaches.humanistic'),
    t('approaches.cbt'),
  ];

  const helpAreas = [
    t('helpAreas.anxiety'),
    t('helpAreas.burnout'),
    t('helpAreas.relationships'),
    t('helpAreas.selfEsteem'),
  ];

  return (
    <main className={styles.root}>
      <Section>
        <div className={styles.hero}>
          <div className={styles.heroImage}>
            <Image
              src="/images/image.jpg"
              alt={t('title')}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className={styles.image}
            />
          </div>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>{t('title')}</h1>
            <p className={styles.subtitle}>{t('subtitle')}</p>
            <div className={styles.experience}>
              <span className={styles.experienceNumber}>5+</span>
              <span className={styles.experienceText}>{t('experience')}</span>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('about.title')}</h2>
            <p className={styles.text}>{t('about.description')}</p>
            <p className={styles.text}>{t('about.help')}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('approaches.title')}</h2>
            <div className={styles.approaches}>
              {approaches.map((approach, index) => (
                <div key={index} className={styles.approachCard}>
                  <span className={styles.approachIcon}>✨</span>
                  <span className={styles.approachText}>{approach}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('helpAreas.title')}</h2>
            <div className={styles.helpAreas}>
              {helpAreas.map((area, index) => (
                <div key={index} className={styles.helpAreaCard}>
                  <span className={styles.helpAreaIcon}>💙</span>
                  <span className={styles.helpAreaText}>{area}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('qualifications.title')}</h2>
            <div className={styles.qualifications}>
              {qualifications.map((qual, index) => (
                <div key={index} className={styles.qualificationCard}>
                  <div className={styles.qualificationIcon}>{qual.icon}</div>
                  <h3 className={styles.qualificationTitle}>{qual.title}</h3>
                  <p className={styles.qualificationDescription}>{qual.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
};

export default AboutPage;
