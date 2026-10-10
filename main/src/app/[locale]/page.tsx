import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';

import metadata from '@/data/metadata';
import { routing } from '@/i18n/routing';
import type { ArticleDto, FaqItemDto } from '@/types';
import Api from '@/utils/Api';

import MainPage from './MainPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? metadata.main[locale] : metadata.main.en;
}

async function getFaqData(locale: string) {
  try {
    return await Api.GET<FaqItemDto[]>({ url: `/faq?locale=${locale}&limit=3` });
  } catch (error) {
    console.error('getFaqData error', error);
    return [];
  }
};

async function getArticlesData(locale: string) {
  try {
    return await Api.GET<ArticleDto[]>({ url: `/articles?locale=${locale}?limit=3` });
  } catch (error) {
    console.error('getArticlesData error', error);
    return [];
  }
};

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const faqData = await getFaqData(locale);
  const articlesData = await getArticlesData(locale);

  return <MainPage faqData={faqData} articlesData={articlesData} />;
};

export default Page;
