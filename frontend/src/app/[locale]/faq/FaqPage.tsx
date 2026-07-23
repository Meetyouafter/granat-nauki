import { getTranslations } from 'next-intl/server';
import Section from '../../../components/Section/Section';
import styles from './FaqPage.module.scss';
import { FC } from 'react';
import { FaqItemDto } from '@/types';

interface IFaqPage {
  faqData: FaqItemDto[];
}

const FaqPage: FC<IFaqPage> = async ({ faqData }) => {
  const t = await getTranslations('FaqPage');

  return (
    <main>
      <Section title={t('title')} lead={t('lead')}>
        <div className={styles.list}>
          {faqData.map((item, index) => (
            <details key={index} className={styles.item}>
              <summary className={styles.summary}>{item.title}</summary>
              <p>{item.description}</p>
            </details>
          ))}
        </div>
      </Section>
    </main>
  );
};

export default FaqPage;
