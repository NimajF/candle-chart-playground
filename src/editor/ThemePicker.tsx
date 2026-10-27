import { TrashIcon } from '@phosphor-icons/react';
import type { Theme } from '../theme/model';

interface ThemePickerProps {
  title: string;
  themes: readonly Theme[];
  activeId: string;
  onSelect: (theme: Theme) => void;
  onDelete?: (theme: Theme) => void; // if not provided, no delete button
  emptyMessage?: string; // shown instead of the list when no themes
}

export function ThemePicker({
  title,
  themes,
  activeId,
  onSelect,
  onDelete,
  emptyMessage,
}: ThemePickerProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-label text-fg-faint uppercase">{title}</h2>

      {themes.length === 0 && emptyMessage ? (
        <p className="rounded-card border border-dashed border-line p-3 text-xs text-fg-faint">
          {emptyMessage}
        </p>
      ) : (
        <ul className="grid grid-cols-3 gap-2">
          {themes.map((theme) => {
            const isActive = theme.id === activeId;

            return (
              <li key={theme.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelect(theme)}
                  aria-pressed={isActive}
                  className={`flex w-full cursor-pointer flex-col gap-2 rounded-card border p-2 text-left text-xs transition-colors duration-150 ease-soft ${
                    isActive
                      ? 'border-accent-line bg-accent-soft'
                      : 'border-line bg-surface hover:border-line-strong hover:bg-hover'
                  }`}
                >
                  <div
                    className="flex h-10 items-end justify-center gap-1.5 rounded-control border border-line pb-2"
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
                    className="absolute top-1 right-1 cursor-pointer rounded-control bg-surface-raised p-1 text-fg-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger focus-visible:opacity-100"
                  >
                    <TrashIcon size={14} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
