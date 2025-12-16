'use client';

import Link from 'next/link';
import { paths } from '@constants';
import styles from './Navigation.module.scss';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import cns from 'classnames';

interface INavigation {
  handleToggleMenu?: () => void;
  isMobile?: boolean;
}

const Navigation: FC<INavigation> = ({ handleToggleMenu, isMobile }) => {
  const t = useTranslations('Header.navigation');
  
  return (
    <nav className={cns(styles.root, { [styles.mobile]: isMobile })}>
      <Link className={styles.link} href={paths.about} onClick={handleToggleMenu}>{t('about')}</Link>
      <Link className={styles.link} href={paths.services} onClick={handleToggleMenu}>{t('services')}</Link>
      <Link className={styles.link} href={paths.articles} onClick={handleToggleMenu}>{t('articles')}</Link>
      <Link className={styles.link} href={paths.reviews} onClick={handleToggleMenu}>{t('reviews')}</Link>
      <Link className={styles.link} href={paths.faq} onClick={handleToggleMenu}>{t('faq')}</Link>
      <Link className={styles.cta} href={paths.contacts} onClick={handleToggleMenu}>{t('contacts')}</Link>
    </nav>
  );
};

export default Navigation;