import { useState } from 'react';
import { useAppTheme } from './app-theme/useAppTheme';
import { ThemeToggle } from './ui/ThemeToggle';
import type { Theme } from './theme/model';
import type { Candle, CandleParams } from './chart/types';
import { CandleChart } from './chart/CandleChart';
import { ThemePicker } from './editor/ThemePicker';
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

  const [pendingConfirm, setPendingConfirm] = useState<ConfirmRequest | null>(null);

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
    <div
      className={
        isFullscreen
          ? 'h-dvh bg-canvas text-fg'
          : 'min-h-dvh bg-canvas text-fg lg:grid lg:grid-cols-[minmax(0,1fr)_22rem]'
      }
    >
      <section
        className={
          isFullscreen
            ? 'h-dvh bg-canvas'
            : 'sticky top-0 z-10 h-[45dvh] border-b border-line bg-canvas p-4 lg:h-dvh lg:border-r lg:border-b-0'
        }
      >
        <div className={`relative h-full overflow-hidden ${isFullscreen ? '' : 'rounded-panel'}`}>
          <CandleChart colors={editor.colors} candles={candles} />
          <div className="absolute top-3 left-3 z-10">
            <FullscreenToggle isFullscreen={isFullscreen} onToggle={fullscreen.toggleFullscreen} />
          </div>
        </div>
      </section>

      <aside className={isFullscreen ? 'hidden' : 'space-y-4 p-4'}>
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Theme Playground</h1>
          <ThemeToggle theme={appTheme.theme} onToggle={appTheme.toggleTheme} />
        </header>

        <ThemePicker
          title="Presets"
          themes={PRESET_THEMES}
          activeId={editor.base.id}
          onSelect={(theme) => handleSelectTheme(presetAsCopy(theme))}
        />
        <ThemePicker
          title="Saved"
          emptyMessage="No saved themes yet. Edit a theme and press Save."
          themes={savedThemes.themes}
          activeId={editor.base.id}
          onSelect={handleSelectTheme}
          onDelete={handleDelete}
        />

        <input
          type="text"
          value={editor.themeName}
          onChange={(e) => editor.setThemeName(e.target.value)}
          placeholder="Theme Name"
          aria-label="Theme name"
          className="w-full rounded-control border border-line-strong bg-field px-3 py-2.5 text-sm font-medium tracking-wide text-fg outline-none transition-colors duration-150 ease-soft placeholder:text-fg-faint hover:bg-hover focus:border-accent-line focus:ring-4 focus:ring-accent-soft"
        />
        <CandleControls
          params={candleParams}
          onChange={setCandleParams}
          onApply={handleApplyCandleParams}
          onRandomize={handleRandomizeCandles}
        />
        <ColorEditor
          colors={editor.colors}
          onChange={editor.setColor}
          onRandomize={handleRandomizeCandleColors}
        />
        <button
          type="button"
          onClick={handleSave}
          className="w-full cursor-pointer rounded-control bg-accent px-3 py-2.5 text-sm font-semibold tracking-wide text-accent-fg shadow-accent transition-colors duration-150 ease-soft hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft disabled:cursor-not-allowed disabled:bg-field disabled:text-fg-faint disabled:shadow-none"
          disabled={!editor.isDirty}
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-full cursor-pointer rounded-control border border-line-strong bg-field px-3 py-2.5 text-sm font-semibold tracking-wide text-fg transition-colors duration-150 ease-soft hover:bg-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft disabled:cursor-not-allowed disabled:border-line disabled:text-fg-faint disabled:hover:bg-field"
          disabled={!editor.isDirty}
        >
          Reset
        </button>
      </aside>
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
