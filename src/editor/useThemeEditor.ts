import { useState } from 'react';
import { COLOR_KEYS, type ColorKey, type Theme } from '../theme/model';

export function useThemeEditor(initialTheme: Theme) {
  const [base, setBase] = useState<Theme>(initialTheme); // the loaded theme, never modified
  const [colors, setColors] = useState(initialTheme.colors); // the copy being edited

  const isDirty = COLOR_KEYS.some((key) => colors[key] !== base.colors[key]);

  function loadTheme(theme: Theme) {
    setBase(theme);
    setColors(theme.colors);
  }

  function setColor(key: ColorKey, value: string) {
    setColors((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setColors(base.colors);
  }
  return { base, colors, isDirty, loadTheme, setColor, reset };
}
