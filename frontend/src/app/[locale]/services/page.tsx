import Section from '../../../components/Section/Section';
import ServiceCard from '../../../components/ServiceCard/ServiceCard';
import styles from './page.module.scss';
import { servicesData } from '../../../data/servicesData';

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
