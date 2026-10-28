import { useState, useEffect } from 'react';

export type AppTheme = 'light' | 'dark';

// Keep in sync with the inline script in index.html
const STORAGE_KEY = 'candle-theme-playground:app-theme';

function readAppTheme(): AppTheme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // ignore errors, e.g. if localStorage is disabled
  }
  // No saved -> follow the OS preference
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function writeAppTheme(theme: AppTheme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore errors, e.g. if localStorage is disabled
  }
}

export function useAppTheme() {
  const [theme, setTheme] = useState<AppTheme>(() => readAppTheme());

  // tokens.css switches the palette based on this attribute
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    writeAppTheme(nextTheme);
  }

  return { theme, toggleTheme };
}
