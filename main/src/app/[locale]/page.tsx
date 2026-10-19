import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';

import { getArticles } from '@/data/articlesData';
import { getFaqItems } from '@/data/faqData';
import metadata from '@/data/metadata';
import { routing } from '@/i18n/routing';

import MainPage from './MainPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? metadata.main[locale] : metadata.main.en;
}

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const faqData = getFaqItems(locale, 3);
  const articlesData = getArticles(locale, 3);

  return <MainPage faqData={faqData} articlesData={articlesData} />;
};

export default Page;
