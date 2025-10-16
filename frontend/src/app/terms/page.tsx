import styles from './page.module.scss';

export default async function TermsPage() {
  return (
    <main>
      <section className={styles.section}>
        <div className={styles.container}>
          <h1 className={styles.title}>Пользовательское соглашение</h1>
          <p className={styles.muted}>Черновая версия. Проверьте правовые формулировки.</p>
          <p>Используя сайт, вы соглашаетесь с условиями и правилами, изложенными в данном документе.</p>
        </div>
      </section>
    </main>
  );
}


