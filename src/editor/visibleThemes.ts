import type { Theme } from '../theme/model';

const MAX_VISIBLE_THEMES = 6;
const MAX_SAVED_THEMES = 4;

export function pickVisibleThemes(
  saved: readonly Theme[],
  presets: readonly Theme[],
  activeId: string,
): readonly Theme[] {
  const newestSaved = [...saved].reverse().slice(0, MAX_SAVED_THEMES);
  const visible = [...newestSaved, ...presets.slice(0, MAX_VISIBLE_THEMES - newestSaved.length)];

  if (visible.some((theme) => theme.id === activeId)) return visible;

  const active = [...saved, ...presets].find((theme) => theme.id === activeId);
  return active ? [...visible.slice(0, -1), active] : visible;
}
