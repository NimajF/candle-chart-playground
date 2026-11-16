import { COLOR_KEYS, parseHexColor, type Theme } from '../theme/model';

const STORAGE_KEY = 'candle-theme-playground:saved-themes';

// Saved data can be stale or edited by hand, so never trust its shape.
function isTheme(value: unknown): value is Theme {
  if (typeof value !== 'object' || value === null) return false;
  const { id, name, colors } = value as Record<string, unknown>;
  if (typeof id !== 'string' || id === '' || typeof name !== 'string') return false;
  if (typeof colors !== 'object' || colors === null) return false;
  const record = colors as Record<string, unknown>;
  return COLOR_KEYS.every((key) => {
    const color = record[key];
    return typeof color === 'string' && parseHexColor(color) !== null;
  });
}

export function readSavedThemes(): Theme[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isTheme) : [];
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

export function clearSavedThemes() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore errors
  }
}
