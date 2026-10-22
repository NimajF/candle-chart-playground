import type { Theme } from '../theme/model';

const STORAGE_KEY = 'candle-theme-playground:saved-themes';

export function readSavedThemes(): Theme[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeSavedThemes(themes: readonly Theme[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
  } catch {
    // ignore errors, e.g. if localStorage is full or disabled
  }
}
