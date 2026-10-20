'use client';

import { useTranslations } from 'next-intl';

import cns from 'classnames';

import { useTheme } from '@/contexts/ThemeContext';

import styles from './ThemeSwitcher.module.scss';

const ThemeSwitcher = () => {
  const t = useTranslations('Header');
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={styles.button}
      aria-label={t('theme')}
      aria-pressed={theme ? theme === 'dark' : undefined}
      onClick={toggleTheme}
    >
      <span className={cns(styles.icon, styles.sun)} aria-hidden="true" />
      <span className={cns(styles.icon, styles.moon)} aria-hidden="true" />
    </button>
  );
};

export default ThemeSwitcher;
