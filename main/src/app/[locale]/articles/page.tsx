import metadata from '@/data/metadata';
import { Metadata } from 'next';
import ArticlesPage from './ArticlesPage';
import Api from '@/utils/Api';
import { ArticleDto } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  return metadata.articles[locale as keyof typeof metadata.articles] ?? metadata.articles.en;
}

async function getArticlesData(locale: string) {
  try {
    return await Api.GET<ArticleDto[]>({ url: `/articles?locale=${locale}` });
  } catch (error) {
    throw new Error('getArticlesData error' + error);
  }
};

const Page = async ({ params }: { params: Promise<{ locale: string }>}) => {
  const { locale } = await params;
  const articles = await getArticlesData(locale);

  return <ArticlesPage articles={articles} />;
};

export default Page;
