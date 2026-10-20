'use client';

import { useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import classNames from 'classnames';

import HamburgerMenu from '@components/Header/components/HamburgerMenu/HamburgerMenu';
import LanguageSwitcher from '@components/Header/components/LanguageSwitcher/LanguageSwitcher';
import Navigation from '@components/Header/components/Navigation/Navigation';
import ThemeSwitcher from '@components/Header/components/ThemeSwitcher/ThemeSwitcher';

import styles from './MobileNavigation.module.scss';

// портал в document.body можно рендерить только на клиенте
const subscribeNoop = () => () => undefined;
const getIsClient = () => true;
const getIsServer = () => false;

const MobileNavigation = () => {
  const t = useTranslations('Header');
  const pathname = usePathname();
  // меню открыто для конкретного адреса: при переходе на другую страницу оно закрывается само
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const isOpen = openedAt === pathname;
  const isClient = useSyncExternalStore(subscribeNoop, getIsClient, getIsServer);

  const handleToggleMenu = () => {
    setOpenedAt(isOpen ? null : pathname);
  };

  if (!isClient) {
    return null;
  }

  return createPortal(
    <>
      <HamburgerMenu label={t('menu')} isOpen={isOpen} onClick={handleToggleMenu} />
      <div
        className={classNames(styles.overlay, isOpen && styles.open)}
        onClick={handleToggleMenu}
      />
      <div className={classNames(styles.menu, isOpen && styles.open)}>
        <div className={styles.content}>
          <div className={styles.settings}>
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
          <Navigation handleToggleMenu={handleToggleMenu} isMobile />
        </div>
      </div>
    </>,
    document.body,
  );
};

export default MobileNavigation;
