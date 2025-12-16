import Section from '../../../components/Section/Section';
import styles from './page.module.scss';
import { faqData } from '../../../data/faqData';

const FaqPage = () => {
  return (
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
};

export default FaqPage;
