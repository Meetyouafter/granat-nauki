import Section from '../../../components/Section/Section';
import ServiceCard from '../../../components/ServiceCard/ServiceCard';
import styles from './page.module.scss';

const services = [
  {
    title: 'Развивающие занятия',
    description:
      'Индивидуальные занятия, направленные на развитие памяти, внимания, мышления и эмоционального интеллекта. Включают упражнения на концентрацию, работу с образами и планирование, а также мягкую поддержку для уверенности. Подходит детям и взрослым, кто хочет расширить ресурсы и научиться справляться со сложными задачами.',
    duration: '50 минут',
    price: '2 500 ₽',
    image: '/images/image.jpg', // Замените на /images/services/developing.jpg
  },
  {
    title: 'Диагностика',
    description:
      'Комплексная психологическая диагностика: определяем особенности развития, эмоционального состояния и когнитивных процессов. Используем опросники, проективные методики и беседу, чтобы дать понятную картину текущего состояния и рекомендации по дальнейшим шагам.',
    duration: '60 минут',
    price: '3 000 ₽',
    image: '/images/image.jpg', // Замените на /images/services/diagnosis.jpg
  },
  {
    title: 'Психологическая сессия',
    description:
      'Индивидуальная сессия для работы со стрессом, тревогой, выгоранием и личными вопросами. Внимательно сопровождаю, помогаю замечать чувства, понимать их причины и выбирать устойчивые стратегии, чтобы вернуть ясность и энергию к изменениям.',
    duration: '50 минут',
    price: '3 500 ₽',
    image: '/images/image.jpg', // Замените на /images/services/session.jpg
  },
  {
    title: 'Консультация',
    description:
      'Разовая консультация для быстрого разбора ситуации и принятия решения. Подходит, когда нужно получить взгляд со стороны, уточнить варианты и получить конкретные рекомендации по шагам и рискам.',
    duration: '30 минут',
    price: '2 000 ₽',
    image: '/images/image.jpg', // Замените на /images/services/consultation.jpg
  },
];

export default async function ServicesPage() {
  return (
    <main className={styles.main}>
      <Section title="Услуги" lead="Профессиональная помощь в развитии и психологической поддержке.">
        <ul className={styles.list}>
          {services.map((service, index) => (
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
}


