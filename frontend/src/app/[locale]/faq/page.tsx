import metadata from '@/data/metadata';
import FaqPage from './FaqPage';
import { Metadata } from 'next';
 
export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return metadata.faq[params.locale as keyof typeof metadata.faq] ?? metadata.faq.en;
}

async function getFaqData() {
  const res = await fetch('http://localhost:4000/faq2', {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error(`FAQ fetch failed: ${res.status}`);
  }

  return res.json();
}
 
export default async function Page() {
  const faqData = await getFaqData();
  return <FaqPage faqData={faqData} />;
}
