import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';

import { getArticles } from '@/data/articlesData';
import metadata from '@/data/metadata';
import { routing } from '@/i18n/routing';

import ArticlesPage from './ArticlesPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? metadata.articles[locale] : metadata.articles.en;
}

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const articles = getArticles(locale);

  return <ArticlesPage articles={articles} />;
};

export default Page;
