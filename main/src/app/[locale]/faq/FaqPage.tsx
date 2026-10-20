import type { FC } from 'react';
import { getTranslations } from 'next-intl/server';

import type { FaqItemDto } from '@/types';
import FaqList from '@components/FaqList/FaqList';
import Section from '@components/Section/Section';

interface IFaqPage {
  faqData: FaqItemDto[];
}

const FaqPage: FC<IFaqPage> = async ({ faqData }) => {
  const t = await getTranslations('FaqPage');

  return (
    <main>
      <Section title={t('title')} lead={t('lead')} pageTitle>
        <FaqList items={faqData} />
      </Section>
    </main>
  );
};

export default FaqPage;
