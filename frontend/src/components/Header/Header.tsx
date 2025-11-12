import Link from 'next/link';
import Container from '../Container/Container';
import styles from './Header.module.scss';
import { paths } from '@/constants';

export default function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.bar}>
          <Link href={paths.home} className={styles.brand}>
            <strong>Психолог</strong>
            <span>личный сайт</span>
          </Link>
          <nav className={styles.nav}>
            <Link className={styles.link} href={paths.about}>Обо мне</Link>
            <Link className={styles.link} href={paths.services}>Услуги</Link>
            <Link className={styles.link} href={paths.articles}>Статьи</Link>
            <Link className={styles.link} href={paths.reviews}>Отзывы</Link>
            <Link className={styles.link} href={paths.faq}>FAQ</Link>
            <Link className={styles.cta} href={paths.contacts}>Записаться</Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}


