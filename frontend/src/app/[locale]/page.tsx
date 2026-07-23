import { Metadata } from 'next';
import metadata from '@/data/metadata';
import Api from '@/utils/Api';
import MainPage from './MainPage';
import { FaqItemDto } from '@/types';

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

const Page = async ({params}: { params: Promise<{ locale: string }>}) => {
  const { locale } = await params;
  const faqData = await getFaqData(locale);

  return <MainPage faqData={faqData} />;

};

export default Page;
