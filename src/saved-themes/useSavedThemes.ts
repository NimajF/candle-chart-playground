import { useState } from 'react';
import type { Theme } from '../theme/model';
import { readSavedThemes, writeSavedThemes } from './themeStorage';

export function useSavedThemes() {
  const [themes, setThemes] = useState(() => readSavedThemes());

  function update(nextThemesArray: Theme[]) {
    setThemes(nextThemesArray);
    writeSavedThemes(nextThemesArray);
  }

  function saveTheme(theme: Theme) {
    const exists = themes.some((t) => t.id === theme.id);
    update(exists ? themes.map((t) => (t.id === theme.id ? theme : t)) : [...themes, theme]);
  }

  function deleteTheme(themeId: string) {
    update(themes.filter((t) => t.id !== themeId));
  }

  return { themes, saveTheme, deleteTheme };
}
