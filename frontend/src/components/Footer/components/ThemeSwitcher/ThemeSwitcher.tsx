'use client';

import { useTheme } from '@/contexts/ThemeContext';
import styles from './ThemeSwitcher.module.scss';
import Image from 'next/image';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <label htmlFor="theme-switcher" className={styles.switch}>
      <input id="theme-switcher" type="checkbox" checked={theme === 'light'} onClick={toggleTheme} />
      <span className={styles.slider}></span>
      <Image className={styles.moonIcon} src="/icons/moon.svg" alt="Moon" width={20} height={20} />
      <Image className={styles.sunIcon} src="/icons/sun.svg" alt="Sun" width={20} height={20} />
    </label>
  );
}
