import Section from '../components/Section';
import Container from '../components/Container';
import styles from './page.module.scss';

export default async function HomePage() {
  return (
    <main>
      <Section
        id="hero"
        title="Помогаю найти опору в эмоциях и отношениях"
        lead="Индивидуальная и семейная терапия. Онлайн и очно."
      >
        <Container>
          <div className={styles.heroActions}>
            <a href="/contacts" className={styles.ctaPrimary}>Записаться на консультацию</a>
            <a href="/about" className={styles.ctaSecondary}>Узнать обо мне</a>
          </div>
        </Container>
      </Section>

      <Section id="services" title="Чем я могу помочь" lead="Подберём формат, который подойдёт вашей задаче.">
        <ul className={styles.cardsGridSm}>
          <li className={styles.card}>Индивидуальная терапия</li>
          <li className={styles.card}>Парная/семейная терапия</li>
          <li className={styles.card}>Работа с тревогой и выгоранием</li>
          <li className={styles.card}>Поддержка в кризисные периоды</li>
        </ul>
      </Section>

      <Section id="reviews" title="Отзывы клиентов" lead="Фрагменты обратной связи после сессий.">
        <ul className={styles.cardsGridMd}>
          <li className={styles.card}>
            «Стало спокойнее, появилось ощущение опоры и ясности»
          </li>
          <li className={styles.card}>
            «Проработали важные темы в отношениях, стало легче говорить»
          </li>
          <li className={styles.card}>
            «Очень бережно и профессионально, спасибо за поддержку»
          </li>
        </ul>
      </Section>

      <Section id="articles" title="Статьи" lead="Небольшие заметки про эмоции, отношения и заботу о себе.">
        <ul className={styles.cardsGridMd}>
          <li className={styles.card}>
            Как справляться с тревогой на работе
          </li>
          <li className={styles.card}>
            Первые шаги при эмоциональном выгорании
          </li>
          <li className={styles.card}>
            Границы в отношениях: как заметить и отстоять
          </li>
        </ul>
      </Section>
    </main>
  );
}


