'use client';

import Link from 'next/link';
import { usePathname } from '@/i18n/navigation';
import { paths } from '@constants';
import styles from './Navigation.module.scss';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import cns from 'classnames';

interface INavigation {
  handleToggleMenu?: () => void;
  isMobile?: boolean;
}

const Navigation: FC<INavigation> = ({ handleToggleMenu, isMobile }) => {
  const t = useTranslations('Header.navigation');
  const pathname = usePathname();

  const links = [
    { href: paths.home, label: t('home') },
    { href: paths.about, label: t('about') },
    { href: paths.services, label: t('services') },
    { href: paths.articles, label: t('articles') },
    { href: paths.reviews, label: t('reviews') },
    { href: paths.faq, label: t('faq') },
  ];

  // next/link не принимает onClick={undefined} (exactOptionalPropertyTypes),
  // поэтому onClick передаётся, только если он есть
  const linkProps = handleToggleMenu ? { onClick: handleToggleMenu } : {};

  return (
    <nav className={cns(styles.root, isMobile && styles.mobile)}>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          className={cns(styles.link, pathname === href && styles.active)}
          href={href}
          {...linkProps}
        >
          {label}
        </Link>
      ))}
      <Link className={styles.cta} href={paths.contacts} {...linkProps}>{t('contacts')}</Link>
    </nav>
  );
};

export default Navigation;