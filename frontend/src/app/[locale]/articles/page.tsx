import Section from '../../../components/Section/Section';
import styles from './page.module.scss';

export default async function ArticlesPage() {
  return (
    <main>
      <Section title="Статьи" lead="Подборка полезных материалов.">
        <ul className={styles.list}>
          <li className={styles.card}>Как заметить признаки выгорания</li>
          <li className={styles.card}>Почему сложно говорить о чувствах</li>
          <li className={styles.card}>Тревога: стратегии самопомощи</li>
        </ul>
      </Section>
    </main>
  );
}


