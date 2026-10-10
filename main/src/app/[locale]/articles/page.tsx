import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';

import metadata from '@/data/metadata';
import { routing } from '@/i18n/routing';
import type { ArticleDto } from '@/types';
import Api from '@/utils/Api';

import ArticlesPage from './ArticlesPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? metadata.articles[locale] : metadata.articles.en;
}

async function getArticlesData(locale: string) {
  try {
    return await Api.GET<ArticleDto[]>({ url: `/articles?locale=${locale}` });
  } catch (error) {
    throw new Error('getArticlesData error', { cause: error });
  }
};

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const articles = await getArticlesData(locale);

  return <ArticlesPage articles={articles} />;
};

export default Page;
