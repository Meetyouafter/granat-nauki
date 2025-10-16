import Link from 'next/link';
import Section from '../../components/Section';
import styles from './page.module.scss';

export default async function ReviewsPage() {
  return (
    <main>
      <Section title="Отзывы" lead="Анонимные фрагменты обратной связи.">
        <div className={styles.topBar}>
          <Link href="/reviews/new" className={styles.link}>
            Оставить отзыв
          </Link>
        </div>
        <ul className={styles.list}>
          <li className={styles.card}>Спасибо за бережность и внимание</li>
          <li className={styles.card}>Появилось больше ясности и энергии</li>
          <li className={styles.card}>Научилась замечать свои потребности</li>
        </ul>
      </Section>
    </main>
  );
}


