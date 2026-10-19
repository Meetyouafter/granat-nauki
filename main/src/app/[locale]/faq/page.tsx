import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';

import { getFaqItems } from '@/data/faqData';
import metadata from '@/data/metadata';
import { routing } from '@/i18n/routing';

import FaqPage from './FaqPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? metadata.faq[locale] : metadata.faq.en;
}

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const faqData = getFaqItems(locale);

  return <FaqPage faqData={faqData} />;
};

export default Page;
