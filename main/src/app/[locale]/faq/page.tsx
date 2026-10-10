import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';

import metadata from '@/data/metadata';
import { routing } from '@/i18n/routing';
import type { FaqItemDto } from '@/types';
import Api from '@/utils/Api';

import FaqPage from './FaqPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? metadata.faq[locale] : metadata.faq.en;
}

async function getFaqData(locale: string) {
  try {
    return await Api.GET<FaqItemDto[]>({ url: `/faq?locale=${locale}` });
  } catch (error) {
    console.error('getFaqData error', error);
    return [];
  }
};

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const faqData = await getFaqData(locale);

  return <FaqPage faqData={faqData} />;
};

export default Page;
