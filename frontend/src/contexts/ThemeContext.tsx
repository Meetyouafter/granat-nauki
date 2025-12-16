'use client';

import { THEME } from '@constants';
import { createContext, useContext, useState, ReactNode, useLayoutEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
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
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme | null>(null);

  const actionSetTheme = useCallback((correctTheme: Theme) => {
    document.documentElement.setAttribute('data-theme', correctTheme);
    setTheme(correctTheme);
    cookieStore.set({
      name: THEME,
      value: correctTheme,
      path: '/',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
    });
  }, []);

  useLayoutEffect(() => {
    // смотрим тему установленную из cookies
    const settedTheme = document.documentElement.getAttribute('data-theme');
    if (settedTheme) {
      setTheme(settedTheme as Theme);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const correctTheme = prefersDark ? 'dark' : 'light';
    actionSetTheme(correctTheme);
  }, [actionSetTheme]);

  const toggleTheme = () => actionSetTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
