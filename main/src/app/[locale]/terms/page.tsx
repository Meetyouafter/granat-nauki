import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import metadata from '@/data/metadata';
import { routing } from '@/i18n/routing';
import Section from '@components/Section/Section';
import Text from '@ui/Text/Text';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? metadata.terms[locale] : metadata.terms.en;
}
const TermsPage = async () => {
  const t = await getTranslations('TermsPage');

  return (
    <main>
      <Section title={t('title')} pageTitle>
        <Text>{t('pending')}</Text>
      </Section>
    </main>
  );
};

export default TermsPage;
