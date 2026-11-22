import { PencilSimpleIcon } from '@phosphor-icons/react';
import { ThemeSwatch } from './ThemeSwatch';
import type { ThemeEditor } from './useThemeEditor';

// Mobile: theme name sits on the chart like a ticker symbol, and is editable.
export function ThemeNameChip({ editor }: { editor: ThemeEditor }) {
  return (
    <label className="flex min-w-0 items-center gap-2 rounded-control border border-line bg-field py-1 pr-2 pl-1.5 focus-within:border-accent-line focus-within:ring-4 focus-within:ring-accent-soft">
      <ThemeSwatch colors={editor.colors} className="h-5 w-7" />
      <input
        type="text"
        value={editor.themeName}
        onChange={(e) => editor.setThemeName(e.target.value)}
        placeholder="Theme Name"
        aria-label="Theme name"
        className="max-w-40 min-w-16 bg-transparent text-base font-semibold text-fg outline-none field-sizing-content placeholder:text-fg-faint"
      />
      {editor.isDirty ? (
        <span
          className="size-2 shrink-0 rounded-full bg-warning"
          title="Unsaved changes"
          aria-label="Unsaved changes"
        />
      ) : (
        <PencilSimpleIcon size={14} className="shrink-0 text-fg-faint" aria-hidden="true" />
      )}
    </label>
  );
}
