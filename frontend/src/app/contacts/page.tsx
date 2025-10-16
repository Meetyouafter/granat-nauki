import Section from '../../components/Section';
import styles from './page.module.scss';

export default async function ContactsPage() {
  return (
    <main>
      <Section title="Контакты" lead="Выберите удобный способ связи.">
        <ul className={styles.list}>
          <li className={styles.card}>Telegram: @username</li>
          <li className={styles.card}>Email: hello@example.ru</li>
          <li className={styles.card}>Телефон: +7 (999) 000-00-00</li>
        </ul>
        <div className={styles.formWrap}>
          <form action="#" method="post" className={styles.form}>
            <label>
              Имя
              <input name="name" placeholder="Ваше имя" className={styles.input} />
            </label>
            <label>
              Способ связи
              <input name="contact" placeholder="Телефон или Telegram" className={styles.input} />
            </label>
            <label>
              Коротко о запросе
              <textarea name="message" rows={5} placeholder="Чем могу помочь?" className={styles.textarea} />
            </label>
            <button type="submit" className={styles.submit}>Отправить</button>
          </form>
        </div>
      </Section>
    </main>
  );
}


