'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from 'react';

import { THEME } from '@constants';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme | null;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme | undefined;
}

const DARK_QUERY = '(prefers-color-scheme: dark)';

const subscribeToSystemTheme = (onChange: () => void) => {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener('change', onChange);
  return () => {
    query.removeEventListener('change', onChange);
  };
};

const getSystemTheme = (): Theme => (window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light');

// на сервере системная тема неизвестна
const getServerSystemTheme = () => null;

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  // тема, выбранная пользователем (из cookie или переключателем); null — следуем за системой
  const [chosenTheme, setChosenTheme] = useState<Theme | null>(initialTheme ?? null);
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    getServerSystemTheme,
  );
  const theme = chosenTheme ?? systemTheme;

  useLayoutEffect(() => {
    if (!theme) return;

    document.documentElement.setAttribute('data-theme', theme);
    const maxAge = 365 * 24 * 60 * 60; // 1 год
    document.cookie = `${THEME}=${theme}; path=/; max-age=${maxAge}`;
  }, [theme]);

  const toggleTheme = () => {
    setChosenTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
