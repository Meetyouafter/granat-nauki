import metadata from '@/data/metadata';
import FaqPage from './FaqPage';
import { Metadata } from 'next';
import Api from '@/utils/Api';
 
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
    const res = await Api.GET({ url: `/faq?locale=${locale}` });

    if (!res.ok) {
      throw new Error(`FAQ fetch failed: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const faqData = await getFaqData(locale);
  console.log(faqData);
  return <FaqPage faqData={faqData} />;
}
