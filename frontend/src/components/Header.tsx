import Link from 'next/link';
import Container from './Container';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.bar}>
          <Link href="/" className={styles.brand}>
            <strong>Психолог</strong>
            <span>личный сайт</span>
          </Link>
          <nav className={styles.nav}>
            <Link className={styles.link} href="/about">Обо мне</Link>
            <Link className={styles.link} href="/services">Услуги</Link>
            <Link className={styles.link} href="/articles">Статьи</Link>
            <Link className={styles.link} href="/reviews">Отзывы</Link>
            <Link className={styles.link} href="/faq">FAQ</Link>
            <Link className={styles.cta} href="/contacts">Записаться</Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}


