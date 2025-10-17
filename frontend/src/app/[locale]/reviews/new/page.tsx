import Section from '../../../../components/Section';
import styles from './page.module.scss';

export default async function NewReviewPage() {
  return (
    <main>
      <Section title="Оставить отзыв" lead="Анонимно, по желанию.">
        <form action="#" method="post" className={styles.form}>
          <label>
            Имя (опционально)
            <input name="name" placeholder="Например, Анна" className={styles.input} />
          </label>
          <label>
            Отзыв
            <textarea name="text" placeholder="Ваши впечатления" rows={6} className={styles.textarea} />
          </label>
          <button type="submit" className={styles.submit}>Отправить</button>
        </form>
      </Section>
    </main>
  );
}


