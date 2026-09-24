import metadata from '@/data/metadata';
import FaqPage from './FaqPage';
import { Metadata } from 'next';
import Api from '@/utils/Api';
import { FaqItemDto } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  return metadata.faq[locale as keyof typeof metadata.faq] ?? metadata.faq.en;
}

async function getFaqData(locale: string) {
  try {
    return await Api.GET<FaqItemDto[]>({ url: `/faq?locale=${locale}` });
  } catch (error) {
    console.error('getFaqData error', error);
    return [];
  }
};

const Page = async ({params}: { params: Promise<{ locale: string }>}) => {
  const { locale } = await params;
  const faqData = await getFaqData(locale);

  return <FaqPage faqData={faqData} />;
};

export default Page;
