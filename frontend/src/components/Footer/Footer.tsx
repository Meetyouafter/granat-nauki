import Link from 'next/link';
import Container from '../Container/Container';
import styles from './Footer.module.scss';
import { getTranslations } from 'next-intl/server';
import { paths, socialLinks } from '@/constants';
import Image from 'next/image';
import ThemeSwitcher from './components/ThemeSwitcher/ThemeSwitcher';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';
import Socials from './components/Socials/Socials';

export default async function Footer() {
  const t = await getTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.root}>
      <div className={styles.leftSide}>
        <p className={styles.socialsTitle}>{t('socials.title')}</p>
        <Socials />
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      {/* <div className={styles.content}> */}
      <div className={styles.muted}>{t('copyright', { year })}</div>
      <div className={styles.links}>
        <Link className={styles.link} href={paths.contacts}>{t('links.contacts')}</Link>
        <Link className={styles.link} href={paths.privacy}>{t('links.privacy')}</Link>
        <Link className={styles.link} href={paths.terms}>{t('links.terms')}</Link>
      </div>
      {/* </div> */}
    </footer>
  );
}


