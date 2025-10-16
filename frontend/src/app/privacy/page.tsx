import styles from './page.module.scss';

export default async function PrivacyPage() {
  return (
    <main>
      <section className={styles.section}>
        <div className={styles.container}>
          <h1 className={styles.title}>Политика конфиденциальности</h1>
          <p className={styles.muted}>Черновая версия. Актуализируйте текст под ваши процессы.</p>
          <p>Мы уважаем вашу конфиденциальность и обрабатываем персональные данные согласно действующему законодательству.</p>
        </div>
      </section>
    </main>
  );
}


