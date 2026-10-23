import { TrashIcon } from '@phosphor-icons/react';
import type { Theme } from '../theme/model';

interface ThemePickerProps {
  themes: readonly Theme[];
  activeId: string;
  onSelect: (theme: Theme) => void;
  onDelete?: (theme: Theme) => void; // if not provided, no delete button is shown
}

export function ThemePicker({ themes, activeId, onSelect, onDelete }: ThemePickerProps) {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {themes.map((theme) => {
        const isActive = theme.id === activeId;

        return (
          <li key={theme.id} className="group relative">
            <button
              type="button"
              onClick={() => onSelect(theme)}
              aria-pressed={isActive}
              className={`flex w-full flex-col gap-2 rounded-lg border p-2 text-left text-xs transition-colors ${
                isActive ? 'border-zinc-300 bg-zinc-800' : 'border-zinc-800 hover:border-zinc-600'
              }`}
            >
              {/* Swatch: background with an up and a down bar */}
              <div
                className="flex h-10 items-end justify-center gap-1.5 rounded border border-zinc-700 pb-2"
                style={{ backgroundColor: theme.colors.background }}
              >
                <div
                  className="h-5 w-2 rounded-sm"
                  style={{ backgroundColor: theme.colors.upBody }}
                />
                <div
                  className="h-3 w-2 rounded-sm"
                  style={{ backgroundColor: theme.colors.downBody }}
                />
              </div>

              <span>{theme.name}</span>
            </button>

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(theme)}
                aria-label={`Delete ${theme.name}`}
                title={`Delete ${theme.name}`}
                className="absolute top-1 right-1 cursor-pointer rounded bg-zinc-900/80 p-1 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400 focus-visible:opacity-100"
              >
                <TrashIcon size={14} />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
