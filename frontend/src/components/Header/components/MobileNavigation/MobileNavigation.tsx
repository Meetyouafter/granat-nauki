'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from '../Navigation/Navigation';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import styles from './MobileNavigation.module.scss';
import { createPortal } from 'react-dom';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const handleToggleMenu = () => setIsOpen(prev => !prev);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Закрываем меню при изменении маршрута
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <HamburgerMenu isOpen={isOpen} onClick={handleToggleMenu} />
      {isOpen && createPortal(
        <>
          <div className={`${styles.overlay} ${styles.open}`} onClick={closeMenu} />
          <div className={`${styles.menu} ${styles.open}`}>
            <HamburgerMenu isOpen={isOpen} onClick={handleToggleMenu} />
            <Navigation handleToggleMenu={closeMenu} isMobile />
          </div>
        </>,
        document.body
      )}
    </>
  );
};

export default MobileNavigation;

