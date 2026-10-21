import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import metadata from '@/data/metadata';
import { routing } from '@/i18n/routing';
import { getServicesForClient } from '@/lib/services/services';
import EmptyState from '@components/EmptyState/EmptyState';
import Section from '@components/Section/Section';
import ServiceCard from '@components/ServiceCard/ServiceCard';

import styles from './page.module.scss';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? metadata.services[locale] : metadata.services.en;
}

const ServicesPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const t = await getTranslations('ServicesPage');
  const services = await getServicesForClient(locale);

  return (
    <main>
      <Section title={t('title')} lead={t('lead')} pageTitle>
        {services.length === 0 && <EmptyState />}
        {services.length > 0 && (
          <ul className={styles.list}>
            {services.map(service => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                duration={service.duration}
                price={service.price}
              />
            ))}
          </ul>
        )}
      </Section>
    </main>
  );
};

export default ServicesPage;
