import Link from 'next/link';
import Container from './Container';
import styles from './Footer.module.scss';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.row}>
          <div className={styles.muted}>© {year} Психолог. Все права защищены.</div>
          <div className={styles.links}>
            <Link className={styles.link} href="/contacts">Контакты</Link>
            <Link className={styles.link} href="/privacy">Политика конфиденциальности</Link>
            <Link className={styles.link} href="/terms">Пользовательское соглашение</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}


