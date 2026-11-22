import type { Theme } from '../theme/model';
import type { ColorLocks } from '../theme/randomColors';
import type { ThemeEditor } from '../editor/useThemeEditor';
import { SectionTitle } from '../ui/SectionTitle';
import { ThemeList, ThemeListHeader } from '../editor/ThemeList';
import { ColorEditor } from '../editor/ColorEditor';
import { CopyIcon, SwatchesIcon, TagIcon } from '@phosphor-icons/react';
import { TradingViewLink } from '../tradingview/TradingViewLink';

interface SidebarProps {
  editor: ThemeEditor;
  visibleThemes: readonly Theme[]; // the short list shown in the sidebar
  totalThemes: number; // shown in the "View all" link
  onPickTheme: (theme: Theme) => void;
  onViewAllThemes: () => void;
  onRandomizeColors: (locks: ColorLocks) => void;
  onReset: () => void;
  onSave: () => void;
  onSaveAsNew: () => void;
  onOpenTradingView: () => void;
}

// Desktop: the editor column on the right of the chart.
export function Sidebar({
  editor,
  visibleThemes,
  totalThemes,
  onPickTheme,
  onViewAllThemes,
  onRandomizeColors,
  onReset,
  onSave,
  onSaveAsNew,
  onOpenTradingView,
}: SidebarProps) {
  return (
    <aside className="flex min-h-0 flex-col border-l border-line bg-surface">
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-x-hidden overflow-y-auto p-4">
        <section className="space-y-2">
          <header className="flex items-center justify-between">
            <SectionTitle icon={SwatchesIcon}>Themes</SectionTitle>
            <button
              type="button"
              onClick={onViewAllThemes}
              className="cursor-pointer text-xs font-semibold text-fg-muted transition-colors duration-150 ease-soft hover:text-fg"
            >
              View all ({totalThemes})
            </button>
          </header>
          <div className="-mx-4">
            <ThemeListHeader />
            <ThemeList themes={visibleThemes} activeId={editor.base.id} onSelect={onPickTheme} />
          </div>
        </section>

        <hr className="border-line" />

        <label className="block space-y-2.5">
          <SectionTitle icon={TagIcon} as="span">
            Name
          </SectionTitle>
          <input
            type="text"
            value={editor.themeName}
            onChange={(e) => editor.setThemeName(e.target.value)}
            placeholder="Theme Name"
            className="w-full rounded-control border border-line-strong bg-field px-3 py-2 text-sm font-semibold text-fg outline-none transition-colors duration-150 ease-soft placeholder:text-fg-faint hover:bg-hover focus:border-accent-line focus:ring-4 focus:ring-accent-soft"
          />
        </label>

        <hr className="border-line" />

        <ColorEditor
          colors={editor.colors}
          onChange={editor.setColor}
          onRandomize={onRandomizeColors}
        />
      </div>

      <footer className="shrink-0 space-y-3 border-t border-line bg-surface p-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            disabled={!editor.isDirty}
            className="flex-1 cursor-pointer rounded-control border border-line-strong px-3 py-2 text-sm font-semibold text-fg-muted transition-colors duration-150 ease-soft hover:bg-hover hover:text-fg focus-visible:ring-4 focus-visible:ring-accent-soft focus-visible:outline-none disabled:cursor-not-allowed disabled:text-fg-faint disabled:hover:bg-transparent"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!editor.isDirty}
            className="flex-1 cursor-pointer rounded-control bg-accent px-4 py-2 text-sm font-semibold text-accent-fg shadow-accent transition-colors duration-150 ease-soft hover:bg-accent-hover focus-visible:ring-4 focus-visible:ring-accent-soft focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-field disabled:text-fg-faint disabled:shadow-none"
          >
            Save
          </button>
        </div>

        <button
          type="button"
          onClick={onSaveAsNew}
          disabled={!editor.isDirty}
          title="Keep the original and save your changes as a separate theme"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-control border border-line-strong px-3 py-2 text-sm font-semibold text-fg-muted transition-colors duration-150 ease-soft hover:bg-hover hover:text-fg focus-visible:ring-4 focus-visible:ring-accent-soft focus-visible:outline-none disabled:cursor-not-allowed disabled:text-fg-faint disabled:hover:bg-transparent"
        >
          <CopyIcon size={16} />
          Save as new theme
        </button>

        <TradingViewLink onClick={onOpenTradingView} />
      </footer>
    </aside>
  );
}
