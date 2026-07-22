import { paths } from '@constants';
import Section from '../../components/Section/Section';
import Reveal from '../../components/Reveal/Reveal';
import StatCounter from '../../components/StatCounter/StatCounter';
import PomegranateMark from '../../components/PomegranateMark/PomegranateMark';
import Text from '@ui/Text/Text';
import Card from '@ui/Card/Card';
import CardGrid from '@ui/CardGrid/CardGrid';
import Button from '@ui/Button/Button';
import TextLink from '@ui/TextLink/TextLink';
import Slider from '@ui/Slider/Slider';
import styles from './page.module.scss';
import { getTranslations } from 'next-intl/server';

const HomePage = async () => {
  const t = await getTranslations('HomePage');

  const heroSlides = [1, 2, 3, 4, 5].map((index) => ({
    src: `/images/homePage/slide${index}.jpg`,
    alt: `${t('hero.title')} ${index}`,
  }));

  return (
    <main className={styles.root}>
      <Section id="hero">
        <div className={styles.hero}>
          <PomegranateMark variant="plate" className={styles.heroMotif} />
          <div className={styles.heroContent}>
            <Text as="p" size="md" weight="bold" className={styles.heroKicker}>
              {t('hero.kicker')}
            </Text>
            <Text as="h1" size="xxl" weight="semibold" italic className={styles.heroTitle}>
              {t('hero.title')}
            </Text>
            <Text as="p" size="md" className={styles.heroLead}>
              {t('hero.lead')}
            </Text>
            <div className={styles.heroActions}>
              <Button href={paths.contacts} variant="primary" className={styles.ctaPrimary}>
                {t('hero.ctaPrimary')}
                <Text as="span" size="md" className={styles.ctaArrow}>
                  →
                </Text>
              </Button>
              <Button href={paths.about} variant="secondary">
                {t('hero.ctaSecondary')}
              </Button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <Slider items={heroSlides} />
          </div>
        </div>
      </Section>

      <Reveal>
        <Section id="trust-bar" title={t('trustBar.title')} lead={t('trustBar.lead')}>
          <CardGrid minWidth={240}>
            {t.raw('trustBar.items').map((item: { title: string; description: string }, index: number) => (
              <Card key={index} className={styles.trustBarCard}>
                <PomegranateMark variant="seed" className={styles.trustBarIcon} />
                <Text as="h3" size="sm" weight="bold" className={styles.trustBarCardTitle}>
                  {item.title}
                </Text>
                <Text as="p" size="xs" className={styles.trustBarCardDesc}>
                  {item.description}
                </Text>
              </Card>
            ))}
          </CardGrid>
        </Section>
      </Reveal>

      <Reveal>
        <Section id="about-psychologist" title={t('aboutPsychologist.title')} lead={t('aboutPsychologist.lead')}>
          <div className={styles.textBlock}>
            <Text as="p">{t('aboutPsychologist.paragraph1')}</Text>
            <Text as="p">{t('aboutPsychologist.paragraph2')}</Text>
          </div>
        </Section>
      </Reveal>

      <Section id="personal-experience" title={t('personalExperience.title')} lead={t('personalExperience.lead')}>
        <Reveal className={styles.personalExperience}>
          <div className={styles.personalExperienceStat}>
            <StatCounter value={15} className={styles.personalExperienceStatNumber} />
            <Text as="span" size="sm" weight="semibold" className={styles.personalExperienceStatSuffix}>
              {t('personalExperience.statSuffix')}
            </Text>
          </div>
          <div className={styles.textBlock}>
            <Text as="p">{t('personalExperience.short')}</Text>
          </div>
          <TextLink href={paths.about}>{t('personalExperience.linkText')}</TextLink>
        </Reveal>
      </Section>

      <Reveal>
        <Section id="work-with-children" title={t('workWithChildren.title')} lead={t('workWithChildren.lead')}>
          <CardGrid minWidth={280}>
            <Card className={styles.workCard}>
              <PomegranateMark variant="seed" className={styles.workCardIcon} />
              <Text as="h3" size="md" weight="bold" className={styles.workCardTitle}>
                {t('workWithChildren.childPsychologist.title')}
              </Text>
              <Text as="p" size="xs" className={styles.workCardDesc}>
                {t('workWithChildren.childPsychologist.description')}
              </Text>
            </Card>
            <Card className={styles.workCard}>
              <PomegranateMark variant="seed" className={styles.workCardIcon} />
              <Text as="h3" size="md" weight="bold" className={styles.workCardTitle}>
                {t('workWithChildren.childDevelopment.title')}
              </Text>
              <Text as="p" size="xs" className={styles.workCardDesc}>
                {t('workWithChildren.childDevelopment.description')}
              </Text>
            </Card>
            <Card className={styles.workCard}>
              <PomegranateMark variant="seed" className={styles.workCardIcon} />
              <Text as="h3" size="md" weight="bold" className={styles.workCardTitle}>
                {t('workWithChildren.schoolPrep.title')}
              </Text>
              <Text as="p" size="xs" className={styles.workCardDesc}>
                {t('workWithChildren.schoolPrep.description')}
              </Text>
            </Card>
            <Card className={styles.workCard}>
              <PomegranateMark variant="seed" className={styles.workCardIcon} />
              <Text as="h3" size="md" weight="bold" className={styles.workCardTitle}>
                {t('workWithChildren.tutor.title')}
              </Text>
              <Text as="p" size="xs" className={styles.workCardDesc}>
                {t('workWithChildren.tutor.description')}
              </Text>
            </Card>
          </CardGrid>
        </Section>
      </Reveal>

      <Reveal>
        <Section id="services" title={t('services.title')} lead={t('services.lead')}>
          <CardGrid minWidth={240}>
            {t.raw('services.items').map((item: string, index: number) => (
              <Card key={index} className={styles.serviceCard}>
                <PomegranateMark variant="seed" className={styles.serviceIcon} />
                <Text as="h3" size="md" weight="semibold" className={styles.serviceTitle}>
                  {item}
                </Text>
              </Card>
            ))}
          </CardGrid>
        </Section>
      </Reveal>

      <Reveal>
        <Section id="reviews" title={t('reviews.title')} lead={t('reviews.lead')}>
          <CardGrid minWidth={300}>
            {t.raw('reviews.items').map((item: string, index: number) => (
              <Card key={index} className={styles.reviewCard}>
                <span className={styles.reviewQuote}>&ldquo;</span>
                <Text as="p" size="sm" italic className={styles.reviewText}>
                  {item}
                </Text>
              </Card>
            ))}
          </CardGrid>
        </Section>
      </Reveal>

      <Reveal>
        <Section id="articles" title={t('articles.title')} lead={t('articles.lead')}>
          <CardGrid minWidth={280}>
            {t.raw('articles.items').map((item: string, index: number) => (
              <Card key={index} className={styles.articleCard}>
                <PomegranateMark variant="seed" className={styles.articleIcon} />
                <Text as="h3" size="md" weight="bold" className={styles.articleTitle}>
                  {item}
                </Text>
                <div className={styles.articleLink}>
                  <Text as="span" size="xs" weight="semibold">
                    {t('articles.readMore')}
                  </Text>
                  <Text as="span" size="sm" className={styles.articleArrow}>
                    →
                  </Text>
                </div>
              </Card>
            ))}
          </CardGrid>
        </Section>
      </Reveal>

      <Reveal>
        <Section id="how-it-works" title={t('howItWorks.title')} lead={t('howItWorks.lead')}>
          <CardGrid ordered minWidth={220}>
            {t.raw('howItWorks.steps').map((step: { title: string; description: string }, index: number) => (
              <Card key={index} className={styles.stepCard}>
                <div className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</div>
                <Text as="h3" size="md" weight="bold" className={styles.stepTitle}>
                  {step.title}
                </Text>
                <Text as="p" size="xs" className={styles.stepDesc}>
                  {step.description}
                </Text>
              </Card>
            ))}
          </CardGrid>
        </Section>
      </Reveal>

      <Reveal>
        <Section id="faq-preview" title={t('faqPreview.title')} lead={t('faqPreview.lead')}>
          <div className={styles.faqPreviewList}>
            {t.raw('faqPreview.items').map((item: { question: string; answer: string }, index: number) => (
              <div key={index} className={styles.faqPreviewItem}>
                <Text as="h3" size="md" weight="bold" className={styles.faqPreviewQuestion}>
                  {item.question}
                </Text>
                <Text as="p" size="sm" className={styles.faqPreviewAnswer}>
                  {item.answer}
                </Text>
              </div>
            ))}
          </div>
          <div className={styles.faqPreviewLinkWrap}>
            <TextLink href={paths.faq}>{t('faqPreview.linkText')}</TextLink>
          </div>
        </Section>
      </Reveal>

      <Reveal>
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
      </Reveal>
    </main>
  );
};

export default HomePage;
