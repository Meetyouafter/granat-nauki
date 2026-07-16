import { getTranslations } from 'next-intl/server';
import Section from '../../../components/Section/Section';
import styles from './FaqPage.module.scss';

interface IFaqPage {
  faqData: {
    question: string;
    answer: string;
  }[];
}

const FaqPage = async ({ faqData }: IFaqPage) => {
  const t = await getTranslations('FaqPage');

  return (
    <main>
      <Section title={t('title')} lead={t('lead')}>
        <div className={styles.list}>
          {faqData.map((item, index) => (
            <details key={index} className={styles.item}>
              <summary className={styles.summary}>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </Section>
    </main>
  );
};

export default FaqPage;
