import type { AppTheme } from '../app-theme/useAppTheme';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';

type Props = {
  theme: AppTheme;
  onToggle: () => void;
};
export function ThemeToggle({ theme, onToggle }: Props) {
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className="cursor-pointer rounded-control border border-line bg-field p-2 text-fg-muted transition-colors duration-150 ease-soft hover:bg-hover hover:text-fg"
    >
      {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
    </button>
  );
}
