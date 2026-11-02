import { useState } from 'react';
import { SwatchesIcon, TagIcon } from '@phosphor-icons/react';
import { SectionTitle } from './ui/SectionTitle';
import { useAppTheme } from './app-theme/useAppTheme';
import { ThemeToggle } from './ui/ThemeToggle';
import type { Theme } from './theme/model';
import type { Candle, CandleParams } from './chart/types';
import { CandleChart } from './chart/CandleChart';
import { ThemeList, ThemeListHeader } from './editor/ThemeList';
import { ThemeListDialog } from './editor/ThemeListDialog';
import { pickVisibleThemes } from './editor/visibleThemes';
import { ColorEditor } from './editor/ColorEditor';
import { CandleControls } from './chart/CandleControls';
import { generateRandomCandlesColors, type ColorLocks } from './theme/randomColors';
import { useThemeEditor } from './editor/useThemeEditor';
import { useSavedThemes } from './saved-themes/useSavedThemes';
import { ConfirmDialog, type ConfirmRequest } from './ui/ConfirmDialog';
import { useFullscreen } from './layout/useFullscreen';
import { FullscreenToggle } from './ui/FullscreenToggle';

import {
  DEFAULT_CANDLE_PARAMS,
  generateCandles,
  generateRandomCandlesParams,
} from './chart/generateCandles';
import { PRESET_THEMES, isPresetId, presetAsCopy } from './theme/presets';

export default function App() {
  const appTheme = useAppTheme();
  const fullscreen = useFullscreen();
  const isFullscreen = fullscreen.isFullscreen;

  const [candles, setCandles] = useState<readonly Candle[]>(() =>
    generateCandles(DEFAULT_CANDLE_PARAMS),
  );
  const [candleParams, setCandleParams] = useState<CandleParams>(DEFAULT_CANDLE_PARAMS);
  const editor = useThemeEditor(presetAsCopy(PRESET_THEMES[0]));
  const savedThemes = useSavedThemes();

  const [isThemeListOpen, setIsThemeListOpen] = useState(false);
  const visibleThemes = pickVisibleThemes(savedThemes.themes, PRESET_THEMES, editor.base.id);

  const [pendingConfirm, setPendingConfirm] = useState<ConfirmRequest | null>(null);

  function handlePickTheme(theme: Theme) {
    setIsThemeListOpen(false);
    handleSelectTheme(isPresetId(theme.id) ? presetAsCopy(theme) : theme);
  }

  function handleSave() {
    const theme: Theme = {
      id: isPresetId(editor.base.id) ? crypto.randomUUID() : editor.base.id,
      name: editor.themeName.trim() || 'Untitled Theme',
      colors: editor.colors,
    };
    savedThemes.saveTheme(theme);
    editor.loadTheme(theme);
  }

  function handleReset() {
    setPendingConfirm({
      title: 'Reset theme?',
      message: 'Your unsaved changes will be lost.',
      confirmLabel: 'Reset',
      danger: true,
      onConfirm: editor.reset,
    });
  }

  function handleSelectTheme(theme: Theme) {
    if (!editor.isDirty) {
      editor.loadTheme(theme);
      return;
    }
    setPendingConfirm({
      title: 'Discard changes?',
      message: 'You have unsaved changes. Switching themes will discard them.',
      confirmLabel: 'Discard',
      danger: true,
      onConfirm: () => editor.loadTheme(theme),
    });
  }

  function handleDelete(theme: Theme) {
    setPendingConfirm({
      title: `Delete "${theme.name}"?`,
      message: "This can't be undone.",
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: () => {
        savedThemes.deleteTheme(theme.id);
        // If the deleted theme is the one being edited, fall back to the first preset.
        if (theme.id === editor.base.id) editor.loadTheme(presetAsCopy(PRESET_THEMES[0]));
      },
    });
  }

  function handleRandomizeCandles() {
    const randomParams = generateRandomCandlesParams();
    setCandleParams(randomParams);
    setCandles(generateCandles(randomParams));
  }

  function handleRandomizeCandleColors(locks: ColorLocks) {
    editor.setAllColors(generateRandomCandlesColors(editor.colors, locks));
  }

  // Generates new candles based on the current candleParams state
  function handleApplyCandleParams() {
    setCandles(generateCandles(candleParams));
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas text-fg">
      {!isFullscreen && (
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-4">
          <h1 className="text-base font-semibold">Theme Playground</h1>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={!editor.isDirty}
              className="cursor-pointer rounded-control px-3 py-1.5 text-sm font-semibold text-fg-muted transition-colors duration-150 ease-soft hover:bg-hover hover:text-fg focus-visible:ring-4 focus-visible:ring-accent-soft focus-visible:outline-none disabled:cursor-not-allowed disabled:text-fg-faint disabled:hover:bg-transparent"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!editor.isDirty}
              className="cursor-pointer rounded-control bg-accent px-4 py-1.5 text-sm font-semibold text-accent-fg shadow-accent transition-colors duration-150 ease-soft hover:bg-accent-hover focus-visible:ring-4 focus-visible:ring-accent-soft focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-field disabled:text-fg-faint disabled:shadow-none"
            >
              Save
            </button>
            <span className="mx-1 h-6 w-px bg-line" aria-hidden="true" />
            <ThemeToggle theme={appTheme.theme} onToggle={appTheme.toggleTheme} />
          </div>
        </header>
      )}
      <div
        className={
          isFullscreen
            ? 'grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)]'
            : 'grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_20rem]'
        }
      >
        <section className="flex min-h-0 flex-col">
          {!isFullscreen && (
            <CandleControls
              params={candleParams}
              onChange={setCandleParams}
              onApply={handleApplyCandleParams}
              onRandomize={handleRandomizeCandles}
            />
          )}
          <div className="relative min-h-0 flex-1">
            <CandleChart colors={editor.colors} candles={candles} />
            <div className="absolute top-3 left-3 z-10">
              <FullscreenToggle
                isFullscreen={isFullscreen}
                onToggle={fullscreen.toggleFullscreen}
              />
            </div>
          </div>
        </section>

        {!isFullscreen && (
          <aside className="flex min-h-0 flex-col gap-5 overflow-x-hidden overflow-y-auto border-l border-line bg-surface p-4">
            <section className="space-y-2">
              <header className="flex items-center justify-between">
                <SectionTitle icon={SwatchesIcon}>Themes</SectionTitle>
                <button
                  type="button"
                  onClick={() => setIsThemeListOpen(true)}
                  className="cursor-pointer text-xs font-semibold text-fg-muted transition-colors duration-150 ease-soft hover:text-fg"
                >
                  View all ({PRESET_THEMES.length + savedThemes.themes.length})
                </button>
              </header>
              <div className="-mx-4">
                <ThemeListHeader />
                <ThemeList
                  themes={visibleThemes}
                  activeId={editor.base.id}
                  onSelect={handlePickTheme}
                />
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
              onRandomize={handleRandomizeCandleColors}
            />
          </aside>
        )}
      </div>
      {isThemeListOpen && (
        <ThemeListDialog
          presets={PRESET_THEMES}
          saved={savedThemes.themes}
          activeId={editor.base.id}
          onSelect={handlePickTheme}
          onDelete={handleDelete}
          onClose={() => setIsThemeListOpen(false)}
        />
      )}
      {pendingConfirm && (
        <ConfirmDialog
          title={pendingConfirm.title}
          message={pendingConfirm.message}
          confirmLabel={pendingConfirm.confirmLabel}
          danger={pendingConfirm.danger}
          onConfirm={() => {
            pendingConfirm.onConfirm();
            setPendingConfirm(null);
          }}
          onCancel={() => setPendingConfirm(null)}
        />
      )}
    </div>
  );
}
