import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import type { ArticleDto, FaqItemDto } from '@/types';
import FaqList from '@components/FaqList/FaqList';
import PomegranateMark from '@components/PomegranateMark/PomegranateMark';
import Section from '@components/Section/Section';
import { paths } from '@constants';
import Button from '@ui/Button/Button';
import Card from '@ui/Card/Card';
import Text from '@ui/Text/Text';
import TextLink from '@ui/TextLink/TextLink';

import styles from './MainPage.module.scss';

interface IMainPage {
  faqData: FaqItemDto[];
  articlesData: ArticleDto[];
}

const WORK_AREAS = ['childPsychologist', 'childDevelopment', 'schoolPrep', 'tutor'] as const;

const MainPage = async ({ faqData, articlesData }: IMainPage) => {
  const t = await getTranslations('HomePage');

  const trustItems = t.raw('trustBar.items') as { title: string; description: string }[];
  const reviews = t.raw('reviews.items') as string[];
  const steps = t.raw('howItWorks.steps') as { title: string; description: string }[];

  return (
    <main className={styles.root}>
      <Section id="hero">
        <div className={styles.hero}>
          <PomegranateMark variant="plate" className={styles.heroMotif} />
          <div className={styles.heroContent}>
            <Text as="p" size="md" weight="bold" className={styles.heroKicker}>
              {t('hero.kicker')}
            </Text>
            <Text as="h1" size="xl" weight="semibold" italic className={styles.heroTitle}>
              {t('hero.title')}
            </Text>
            <Text as="p" size="md" className={styles.heroLead}>
              {t('hero.lead')}
            </Text>
            <div className={styles.heroActions}>
              <Button href={paths.contacts} variant="primary" className={styles.ctaPrimary}>
                {t('hero.ctaPrimary')}
                <span className={styles.ctaArrow} aria-hidden="true">→</span>
              </Button>
              <Button href={paths.about} variant="secondary">
                {t('hero.ctaSecondary')}
              </Button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <Image
              src="/images/homePage/slide1.jpg"
              alt={t('hero.imageAlt')}
              fill
              priority
              sizes="(max-width: 768px) 360px, 440px"
              className={styles.heroPhoto}
            />
          </div>
        </div>
      </Section>

      <Section id="trust-bar" title={t('trustBar.title')} lead={t('trustBar.lead')}>
        <ul className={styles.trustBand}>
          {trustItems.map(item => (
            <li key={item.title} className={styles.trustItem}>
              <PomegranateMark variant="seed" className={styles.trustIcon} />
              <Text as="h3" size="md" weight="semibold" italic className={styles.trustTitle}>
                {item.title}
              </Text>
              <Text as="p" size="xs" className={styles.trustDesc}>
                {item.description}
              </Text>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="about-psychologist"
        title={t('aboutPsychologist.title')}
        lead={t('aboutPsychologist.lead')}
      >
        <div className={styles.prose}>
          <Text as="p">{t('aboutPsychologist.paragraph1')}</Text>
          <Text as="p">{t('aboutPsychologist.paragraph2')}</Text>
        </div>
      </Section>

      <Section id="personal-experience" title={t('personalExperience.title')}>
        <div className={styles.experience}>
          <div className={styles.experienceStat}>
            <span className={styles.experienceNumber}>15</span>
            <Text as="span" size="sm" weight="semibold" className={styles.experienceSuffix}>
              {t('personalExperience.statSuffix')}
            </Text>
          </div>
          <div className={styles.prose}>
            <Text as="p" size="md" className={styles.experienceLead}>
              {t('personalExperience.lead')}
            </Text>
            <Text as="p">{t('personalExperience.short')}</Text>
            <TextLink href={paths.about}>{t('personalExperience.linkText')}</TextLink>
          </div>
        </div>
      </Section>

      <Section
        id="work-with-children"
        title={t('workWithChildren.title')}
        lead={t('workWithChildren.lead')}
      >
        <ul className={styles.workGrid}>
          {WORK_AREAS.map(area => (
            <Card key={area} className={styles.workCard}>
              <PomegranateMark variant="seed" className={styles.workIcon} />
              <Text as="h3" size="md" weight="semibold" italic className={styles.workTitle}>
                {t(`workWithChildren.${area}.title`)}
              </Text>
              <Text as="p" size="xs" className={styles.workDesc}>
                {t(`workWithChildren.${area}.description`)}
              </Text>
            </Card>
          ))}
        </ul>
        <div className={styles.sectionLink}>
          <TextLink href={paths.services}>{t('workWithChildren.servicesLink')}</TextLink>
        </div>
      </Section>

      <Section id="reviews" title={t('reviews.title')} lead={t('reviews.lead')}>
        <ul className={styles.quotes}>
          {reviews.map(item => (
            <li key={item} className={styles.quote}>
              <blockquote>
                <Text as="p" size="md" italic className={styles.quoteText}>
                  {item}
                </Text>
              </blockquote>
            </li>
          ))}
        </ul>
        <div className={styles.sectionLink}>
          <TextLink href={paths.reviews}>{t('reviews.linkText')}</TextLink>
        </div>
      </Section>

      <Section id="articles" title={t('articles.title')} lead={t('articles.lead')}>
        <ul className={styles.articleList}>
          {articlesData.map(item => (
            <li key={item.id}>
              <Link href={`${paths.articles}#article-${item.id}`} className={styles.articleRow}>
                <Text as="h3" size="md" weight="semibold" italic className={styles.articleTitle}>
                  {item.title}
                </Text>
                <Text as="p" size="xs" className={styles.articleExcerpt}>
                  {item.content}
                </Text>
                <Text as="span" size="xs" weight="semibold" className={styles.articleMore}>
                  {t('articles.readMore')}
                  <span className={styles.articleArrow} aria-hidden="true">→</span>
                </Text>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="how-it-works" title={t('howItWorks.title')} lead={t('howItWorks.lead')}>
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.stepNumber}>{index + 1}</span>
              <Text as="h3" size="md" weight="semibold" italic className={styles.stepTitle}>
                {step.title}
              </Text>
              <Text as="p" size="xs" className={styles.stepDesc}>
                {step.description}
              </Text>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="faq-preview" title={t('faqPreview.title')} lead={t('faqPreview.lead')}>
        <FaqList items={faqData} />
        <div className={styles.sectionLink}>
          <TextLink href={paths.faq}>{t('faqPreview.linkText')}</TextLink>
        </div>
      </Section>

      <Section id="final-cta">
        <div className={styles.finalCta}>
          <Text as="h2" size="xl" weight="semibold" italic className={styles.finalCtaTitle}>
            {t('finalCta.title')}
          </Text>
          <Text as="p" size="md" className={styles.finalCtaLead}>
            {t('finalCta.lead')}
          </Text>
          <Button href={paths.contacts} variant="primary">
            {t('finalCta.cta')}
          </Button>
        </div>
      </Section>
    </main>
  );
};

export default MainPage;
