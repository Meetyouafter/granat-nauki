import metadata from '@/data/metadata';
import FaqPage from './FaqPage';
import { Metadata } from 'next';
 
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  return metadata.faq[locale as keyof typeof metadata.faq] ?? metadata.faq.en;
}

async function getFaqData(locale: string) {
  const res = await fetch(`http://localhost:4000/faq?locale=${locale}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error(`FAQ fetch failed: ${res.status}`);
  }

  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const faqData = await getFaqData(locale);
  return <FaqPage faqData={faqData} />;
}
