import type { Theme } from '../theme/model';
import { isPresetId } from '../theme/presets';
import { ThemeSwatch } from './ThemeSwatch';
import { TrashIcon } from '@phosphor-icons/react';

export const THEME_ROW_GRID =
  'grid grid-cols-[2.5rem_minmax(0,1fr)_4rem_4rem] items-center gap-3 px-4';

export function ThemeListHeader() {
  return (
    <div className={`${THEME_ROW_GRID} h-7 border-b border-line text-[11px] text-fg-faint`}>
      <span />
      <span>Name</span>
      <span>Up</span>
      <span>Down</span>
    </div>
  );
}

interface ThemeListProps {
  themes: readonly Theme[];
  activeId: string;
  onSelect: (theme: Theme) => void;
  onDelete?: (theme: Theme) => void;
}

export function ThemeList({ themes, activeId, onSelect, onDelete }: ThemeListProps) {
  return (
    <ul>
      {themes.map((theme) => {
        const isActive = theme.id === activeId;
        const canDelete = onDelete && !isPresetId(theme.id);

        return (
          <li key={theme.id} className="group relative">
            <button
              type="button"
              onClick={() => onSelect(theme)}
              aria-pressed={isActive}
              className={`${THEME_ROW_GRID} h-9 w-full cursor-pointer text-left text-sm transition-colors duration-150 ease-soft ${
                isActive ? 'bg-accent-soft' : 'hover:bg-hover'
              }`}
            >
              <ThemeSwatch colors={theme.colors} className="h-6 w-10" />
              <span className="truncate text-sm">{theme.name}</span>
              <HexCell color={theme.colors.upBody} />
              <HexCell color={theme.colors.downBody} />
            </button>

            {canDelete && (
              // Sits over the down column on hover, so rows don't need an extra column
              <button
                type="button"
                onClick={() => onDelete(theme)}
                aria-label={`Delete ${theme.name}`}
                title={`Delete ${theme.name}`}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-control bg-hover p-1 text-fg-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger focus-visible:opacity-100"
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

function HexCell({ color }: { color: string }) {
  return (
    <span className="flex items-center gap-1.5 font-data text-[11px] text-fg-muted">
      <span className="size-2.5 shrink-0 rounded-xs" style={{ backgroundColor: color }} />
      {color.slice(1)}
    </span>
  );
}
