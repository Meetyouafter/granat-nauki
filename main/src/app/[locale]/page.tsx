import { Metadata } from 'next';
import metadata from '@/data/metadata';
import Api from '@/utils/Api';
import MainPage from './MainPage';
import { FaqItemDto, ArticleDto } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  return metadata.main[locale as keyof typeof metadata.main] ?? metadata.main.en;
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

const Page = async ({params}: { params: Promise<{ locale: string }>}) => {
  const { locale } = await params;
  const faqData = await getFaqData(locale);
  const articlesData = await getArticlesData(locale);

  return <MainPage faqData={faqData} articlesData={articlesData} />;
};

export default Page;
