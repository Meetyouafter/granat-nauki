import Image from 'next/image';
import Link from 'next/link';
import Section from '../../components/Section/Section';
import Reveal from '../../components/Reveal/Reveal';
import StatCounter from '../../components/StatCounter/StatCounter';
import styles from './page.module.scss';
import { getTranslations } from 'next-intl/server';

const HomePage = async () => {
  const t = await getTranslations('HomePage');

  const serviceIcons = ['💙', '🌱', '📚', '🎒'];
  const reviewIcons = ['⭐', '💫', '✨'];
  const trustIcons = ['🌱', '💛', '💻', '📚'];
  const stepIcons = ['📩', '🤝', '🗓️', '💬'];

  return (
    <main className={styles.root}>
      <Section id="hero">
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.heroKicker}>{t('hero.kicker')}</p>
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
        <ul className={styles.trustBar}>
          {t.raw('trustBar.items').map((item: string, index: number) => (
            <li key={index} className={styles.trustBarItem}>
              <span className={styles.trustBarIcon}>{trustIcons[index] || '💙'}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Reveal>
        <Section id="about-psychologist" title={t('aboutPsychologist.title')} lead={t('aboutPsychologist.lead')}>
          <div className={styles.textBlock}>
            <p>{t('aboutPsychologist.paragraph1')}</p>
            <p>{t('aboutPsychologist.paragraph2')}</p>
          </div>
        </Section>
      </Reveal>

      <Section id="personal-experience" title={t('personalExperience.title')} lead={t('personalExperience.lead')}>
        <Reveal className={styles.personalExperience}>
          <div className={styles.personalExperienceStat}>
            <StatCounter value={15} className={styles.personalExperienceStatNumber} />
            <span className={styles.personalExperienceStatSuffix}>{t('personalExperience.statSuffix')}</span>
          </div>
          <div className={styles.textBlock}>
            <p>{t('personalExperience.short')}</p>
          </div>
          <Link href="/about" className={styles.personalExperienceLink}>
            {t('personalExperience.linkText')}
          </Link>
        </Reveal>
      </Section>

      <Reveal>
        <Section id="work-with-children" title={t('workWithChildren.title')} lead={t('workWithChildren.lead')}>
          <ul className={styles.workWithChildrenGrid}>
            <li className={styles.workCard}>
              <div className={styles.workCardIcon}>🧒</div>
              <h3 className={styles.workCardTitle}>{t('workWithChildren.childPsychologist.title')}</h3>
              <p className={styles.workCardDesc}>{t('workWithChildren.childPsychologist.description')}</p>
            </li>
            <li className={styles.workCard}>
              <div className={styles.workCardIcon}>🌱</div>
              <h3 className={styles.workCardTitle}>{t('workWithChildren.childDevelopment.title')}</h3>
              <p className={styles.workCardDesc}>{t('workWithChildren.childDevelopment.description')}</p>
            </li>
            <li className={styles.workCard}>
              <div className={styles.workCardIcon}>📚</div>
              <h3 className={styles.workCardTitle}>{t('workWithChildren.schoolPrep.title')}</h3>
              <p className={styles.workCardDesc}>{t('workWithChildren.schoolPrep.description')}</p>
            </li>
            <li className={styles.workCard}>
              <div className={styles.workCardIcon}>🎒</div>
              <h3 className={styles.workCardTitle}>{t('workWithChildren.tutor.title')}</h3>
              <p className={styles.workCardDesc}>{t('workWithChildren.tutor.description')}</p>
            </li>
          </ul>
        </Section>
      </Reveal>

      <Reveal>
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
      </Reveal>

      <Reveal>
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
      </Reveal>

      <Reveal>
        <Section id="articles" title={t('articles.title')} lead={t('articles.lead')}>
          <ul className={styles.articlesGrid}>
            {t.raw('articles.items').map((item: string, index: number) => (
              <li key={index} className={styles.articleCard}>
                <div className={styles.articleIcon}>📝</div>
                <h3 className={styles.articleTitle}>{item}</h3>
                <div className={styles.articleLink}>
                  <span>{t('articles.readMore')}</span>
                  <span className={styles.articleArrow}>→</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </Reveal>

      <Reveal>
        <Section id="how-it-works" title={t('howItWorks.title')} lead={t('howItWorks.lead')}>
          <ol className={styles.stepsGrid}>
            {t.raw('howItWorks.steps').map((step: { title: string; description: string }, index: number) => (
              <li key={index} className={styles.stepCard}>
                <div className={styles.stepNumber}>{stepIcons[index] || String(index + 1)}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </li>
            ))}
          </ol>
        </Section>
      </Reveal>

      <Reveal>
        <Section id="faq-preview" title={t('faqPreview.title')} lead={t('faqPreview.lead')}>
          <div className={styles.faqPreviewList}>
            {t.raw('faqPreview.items').map((item: { question: string; answer: string }, index: number) => (
              <div key={index} className={styles.faqPreviewItem}>
                <h3 className={styles.faqPreviewQuestion}>{item.question}</h3>
                <p className={styles.faqPreviewAnswer}>{item.answer}</p>
              </div>
            ))}
          </div>
          <div className={styles.faqPreviewLinkWrap}>
            <Link href="/faq" className={styles.faqPreviewLink}>
              {t('faqPreview.linkText')}
            </Link>
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Section id="final-cta">
          <div className={styles.finalCta}>
            <h2 className={styles.finalCtaTitle}>{t('finalCta.title')}</h2>
            <p className={styles.finalCtaLead}>{t('finalCta.lead')}</p>
            <Link href="/contacts" className={styles.ctaPrimary}>
              {t('finalCta.cta')}
            </Link>
          </div>
        </Section>
      </Reveal>
    </main>
  );
};

export default HomePage;
