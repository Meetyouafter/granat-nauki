import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import metadata from '@/data/metadata';
import { routing } from '@/i18n/routing';
import Section from '@components/Section/Section';
import ServiceCard from '@components/ServiceCard/ServiceCard';
import { type ServiceId, servicePrices } from '@data/servicesData';

import styles from './page.module.scss';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? metadata.services[locale] : metadata.services.en;
}

const ServicesPage = async () => {
  const t = await getTranslations('ServicesPage');
  const items = t.raw('items') as {
    id: ServiceId;
    title: string;
    description: string;
    duration: string;
  }[];

  return (
    <main>
      <Section title={t('title')} lead={t('lead')} pageTitle>
        <ul className={styles.list}>
          {items.map(item => (
            <ServiceCard
              key={item.id}
              title={item.title}
              description={item.description}
              duration={item.duration}
              price={servicePrices[item.id]}
            />
          ))}
        </ul>
      </Section>
    </main>
  );
};

export default ServicesPage;
