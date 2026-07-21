import { getTranslations } from 'next-intl/server';
import Socials from './components/Socials/Socials';
import styles from './Footer.module.scss';

export default async function Footer() {
  const t = await getTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.root}>
      <div className={styles.container}>
        <p className={styles.copyright}>{t('copyright', { year })}</p>
        <Socials />
      </div>
    </footer>
  );
}


