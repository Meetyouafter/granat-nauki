import Section from '../../../components/Section';
import styles from './page.module.scss';

export default async function FaqPage() {
  return (
    <main>
      <Section title="Частые вопросы" lead="Коротко о важном.">
        <details className={styles.item}>
          <summary>Как проходит первая консультация?</summary>
          <p>Знакомимся, формулируем ваш запрос и договариваемся о формате.</p>
        </details>
        <details className={styles.item}>
          <summary>Можно ли онлайн?</summary>
          <p>Да, работаю в Zoom/Meet. Очные сессии — по договоренности.</p>
        </details>
        <details className={styles.item}>
          <summary>Конфиденциальность?</summary>
          <p>Строго соблюдается. Ваши данные и содержание встреч не передаются третьим лицам.</p>
        </details>
      </Section>
    </main>
  );
}


