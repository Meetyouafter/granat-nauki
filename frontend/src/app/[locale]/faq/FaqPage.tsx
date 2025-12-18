import { FC } from 'react';
import Section from '../../../components/Section/Section';
import styles from './FaqPage.module.scss';

interface IFaqPage {
  faqData: {
    question: string;
    answer: string;
  }[];
}

const FaqPage: FC<IFaqPage> = ({ faqData }) => (
  <main>
    <Section title="Частые вопросы" lead="Коротко о важном.">
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

export default FaqPage;
