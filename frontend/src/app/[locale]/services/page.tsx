import Section from '../../../components/Section/Section';
import styles from './page.module.scss';

export default async function ServicesPage() {
  return (
    <main>
      <Section title="Услуги и формат" lead="Онлайн и очные сессии, индивидуально и для пар.">
        <ul className={styles.list}>
          <li className={styles.card}>
            Индивидуальная сессия — 50 минут
          </li>
          <li className={styles.card}>
            Парная/семейная сессия — 80 минут
          </li>
          <li className={styles.card}>
            Разбор запроса — 30 минут
          </li>
        </ul>
      </Section>
    </main>
  );
}


