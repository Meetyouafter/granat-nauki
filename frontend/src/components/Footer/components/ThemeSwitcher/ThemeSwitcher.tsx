'use client';

import { useTheme } from '@/contexts/ThemeContext';
import styles from './ThemeSwitcher.module.scss';
import Image from 'next/image';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeButton}
      aria-label={`Переключить на ${theme === 'light' ? 'темную' : 'светлую'} тему`}
    >
      {theme === 'light' ? (
        <Image src="/icons/moon.svg" alt="Moon" width={24} height={24} />
      ) : (
        <Image src="/icons/sun.svg" alt="Sun" width={24} height={24} />
      )}
    </button>
  );
}
