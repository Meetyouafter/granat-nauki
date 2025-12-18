import Section from '../../../components/Section/Section';
import ServiceCard from '../../../components/ServiceCard/ServiceCard';
import styles from './page.module.scss';
import { servicesData } from '../../../data/servicesData';
import metadata from '@/data/metadata';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return metadata.services[params.locale as keyof typeof metadata.services] ?? metadata.services.en;
}

const ServicesPage = () => {
  return (
    <main className={styles.main}>
      <Section title="Услуги" lead="Профессиональная помощь в развитии и психологической поддержке.">
        <ul className={styles.list}>
          {servicesData.map((service, index) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              duration={service.duration}
              price={service.price}
              image={service.image}
              index={index}
            />
          ))}
        </ul>
      </Section>
    </main>
  );
};

export default ServicesPage;
