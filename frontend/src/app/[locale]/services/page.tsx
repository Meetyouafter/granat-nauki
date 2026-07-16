import { getTranslations } from 'next-intl/server';
import Section from '../../../components/Section/Section';
import ServiceCard from '../../../components/ServiceCard/ServiceCard';
import styles from './page.module.scss';
import { servicesData } from '../../../data/servicesData';
import metadata from '@/data/metadata';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  return metadata.services[locale as keyof typeof metadata.services] ?? metadata.services.en;
}

const ServicesPage = async () => {
  const t = await getTranslations('ServicesPage');
  const items = t.raw('items') as { title: string; description: string; duration: string }[];

  return (
    <main className={styles.main}>
      <Section title={t('title')} lead={t('lead')}>
        <ul className={styles.list}>
          {items.map((item, index) => (
            <ServiceCard
              key={item.title}
              title={item.title}
              description={item.description}
              duration={item.duration}
              price={servicesData[index].price}
              image={servicesData[index].image}
              index={index}
            />
          ))}
        </ul>
      </Section>
    </main>
  );
};

export default ServicesPage;
