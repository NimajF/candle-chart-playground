import { useState } from 'react';
import { COLOR_KEYS, type ColorKey, type Theme, type ThemeColors } from '../theme/model';

export function useThemeEditor(initialTheme: Theme) {
  const [base, setBase] = useState<Theme>(initialTheme); // the loaded theme, never modified
  const [themeName, setThemeName] = useState(initialTheme.name); // the name of the theme being edited
  const [colors, setColors] = useState(initialTheme.colors); // the copy being edited

  const isDirty =
    themeName !== base.name || COLOR_KEYS.some((key) => colors[key] !== base.colors[key]);

  function loadTheme(theme: Theme) {
    setBase(theme);
    setThemeName(theme.name);
    setColors(theme.colors);
  }

  function setColor(key: ColorKey, value: string) {
    setColors((prev) => ({ ...prev, [key]: value }));
  }

  function setAllColors(newColors: ThemeColors) {
    setColors(newColors);
  }

  function reset() {
    setThemeName(base.name);
    setColors(base.colors);
  }
  return {
    base,
    colors,
    themeName,
    setThemeName,
    isDirty,
    loadTheme,
    setColor,
    reset,
    setAllColors,
  };
}
