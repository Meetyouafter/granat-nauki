import { getTranslations } from 'next-intl/server';
import ThemeSwitcher from './components/ThemeSwitcher/ThemeSwitcher';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';
import Socials from './components/Socials/Socials';
import styles from './Footer.module.scss';

export default async function Footer() {
  const t = await getTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.root}>
      <div className={styles.content}>
        <p>logo</p>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <Socials />
      <p className={styles.copyright}>{t('copyright', { year })}</p>
    </footer>
  );
}


