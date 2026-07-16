'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from '../Navigation/Navigation';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import styles from './MobileNavigation.module.scss';
import { createPortal } from 'react-dom';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const handleToggleMenu = () => setIsOpen(prev => !prev);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Закрываем меню при изменении маршрута
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <>
      <HamburgerMenu isOpen={isOpen} onClick={handleToggleMenu} />
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={handleToggleMenu}
      />
      <div className={`${styles.menu} ${isOpen ? styles.open : ''}`}>
        <Navigation handleToggleMenu={handleToggleMenu} isMobile />
      </div>
    </>,
    document.body
  );
};

export default MobileNavigation;

