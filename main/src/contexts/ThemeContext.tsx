'use client';

import { THEME } from '@constants';
import { createContext, useContext, useState, ReactNode, useLayoutEffect, useCallback } from 'react';

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
  initialTheme?: Theme;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme | null>(initialTheme ?? null);

  const actionSetTheme = useCallback((correctTheme: Theme) => {
    document.documentElement.setAttribute('data-theme', correctTheme);
    setTheme(correctTheme);

    const maxAge = 365 * 24 * 60 * 60; // 1 год
    document.cookie = `${THEME}=${correctTheme}; path=/; max-age=${maxAge}`;
  }, []);

  useLayoutEffect(() => {
    // тема уже пришла с сервера (из cookie) — донастраивать нечего
    if (theme) {
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const correctTheme = prefersDark ? 'dark' : 'light';
    actionSetTheme(correctTheme);
  }, [theme, actionSetTheme]);

  const toggleTheme = () => actionSetTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
