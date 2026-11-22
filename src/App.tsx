import { useState } from 'react';
import { ArrowCounterClockwiseIcon, CopyIcon } from '@phosphor-icons/react';
import { useAppTheme } from './app-theme/useAppTheme';
import { ThemeToggle } from './ui/ThemeToggle';
import type { Theme } from './theme/model';
import type { Candle, CandleParams } from './chart/types';
import { CandleChart } from './chart/CandleChart';
import { ThemeListDialog } from './editor/ThemeListDialog';
import { ThemeNameChip } from './editor/ThemeNameChip';
import { pickVisibleThemes } from './editor/visibleThemes';
import { CandleControls } from './chart/CandleControls';
import { generateRandomCandlesColors, type ColorLocks } from './theme/randomColors';
import { useThemeEditor } from './editor/useThemeEditor';
import { useSavedThemes } from './saved-themes/useSavedThemes';
import { ConfirmDialog, type ConfirmRequest } from './ui/ConfirmDialog';
import { TradingViewDialog } from './tradingview/TradingViewDialog';
import { useFullscreen } from './layout/useFullscreen';
import { useIsMobile } from './layout/useIsMobile';
import { Sidebar } from './layout/Sidebar';
import { MobilePanel } from './layout/MobilePanel';
import { FullscreenToggle } from './ui/FullscreenToggle';
import { BrandLogo } from './ui/BrandLogo';
import {
  DEFAULT_CANDLE_PARAMS,
  generateCandles,
  generateRandomCandlesParams,
} from './chart/generateCandles';
import { PRESET_THEMES, isPresetId, presetAsCopy } from './theme/presets';
import { InfoDialog } from './ui/InfoDialog';
import { InfoButton } from './ui/InfoButton';

export default function App() {
  const appTheme = useAppTheme();
  const fullscreen = useFullscreen();
  const isFullscreen = fullscreen.isFullscreen;
  const isMobile = useIsMobile();

  const [candles, setCandles] = useState<readonly Candle[]>(() =>
    generateCandles(DEFAULT_CANDLE_PARAMS),
  );
  const [candleParams, setCandleParams] = useState<CandleParams>(DEFAULT_CANDLE_PARAMS);
  const editor = useThemeEditor(presetAsCopy(PRESET_THEMES[0]));
  const savedThemes = useSavedThemes();

  const [isThemeListOpen, setIsThemeListOpen] = useState(false);
  const visibleThemes = pickVisibleThemes(savedThemes.themes, PRESET_THEMES, editor.base.id);

  const [isTradingViewOpen, setIsTradingViewOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const [pendingConfirm, setPendingConfirm] = useState<ConfirmRequest | null>(null);

  function handlePickTheme(theme: Theme) {
    setIsThemeListOpen(false);
    handleSelectTheme(isPresetId(theme.id) ? presetAsCopy(theme) : theme);
  }

  function buildTheme(id: string) {
    return {
      id,
      name: editor.themeName.trim() || 'Untitled Theme',
      colors: editor.colors,
    };
  }

  function persistTheme(theme: Theme) {
    savedThemes.saveTheme(theme);
    editor.loadTheme(theme);
  }

  function handleSave() {
    persistTheme(buildTheme(isPresetId(editor.base.id) ? crypto.randomUUID() : editor.base.id));
  }

  function handleSaveAsNew() {
    const theme = buildTheme(crypto.randomUUID());
    // Same name as the original: add a suffix so the two don't look identical in the list
    if (theme.name === editor.base.name) theme.name = `${theme.name} copy`;
    persistTheme(theme);
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

  // Fullscreen: chart only. Mobile: chart on top, panel below. Desktop: chart + sidebar.
  let layoutClass = 'grid-cols-[minmax(0,1fr)_20rem]';
  if (isFullscreen) {
    layoutClass = 'grid-cols-[minmax(0,1fr)]';
  } else if (isMobile) {
    layoutClass = 'grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,3fr)_minmax(0,2fr)]';
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas text-fg">
      {!isFullscreen && (
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-4">
          <h1 className="min-w-0 text-base font-semibold">
            <a
              href="/"
              className="flex items-center gap-2.5 rounded-sm transition-colors duration-150 ease-soft hover:text-fg-muted focus-visible:ring-4 focus-visible:ring-accent-soft focus-visible:outline-none"
            >
              <BrandLogo />
              <span className="truncate">Candle Theme Playground</span>
            </a>
          </h1>

          {isMobile ? (
            // Mobile: the editor actions live in the top bar
            <div className="ml-auto flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                disabled={!editor.isDirty}
                aria-label="Reset theme"
                title="Reset theme"
                className="cursor-pointer rounded-control p-2 text-fg-muted transition-colors duration-150 ease-soft hover:bg-hover hover:text-fg disabled:cursor-not-allowed disabled:text-fg-faint disabled:hover:bg-transparent"
              >
                <ArrowCounterClockwiseIcon size={18} />
              </button>
              <button
                type="button"
                onClick={handleSaveAsNew}
                disabled={!editor.isDirty}
                title="Keep the original and save your changes as a separate theme"
                className="flex cursor-pointer items-center gap-1 rounded-control px-2 py-1.5 text-xs font-semibold text-fg-muted transition-colors duration-150 ease-soft hover:bg-hover hover:text-fg disabled:cursor-not-allowed disabled:text-fg-faint disabled:hover:bg-transparent"
              >
                <CopyIcon size={16} />
                Save as new
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!editor.isDirty}
                className="cursor-pointer rounded-control bg-accent px-4 py-1.5 text-sm font-semibold text-accent-fg shadow-accent transition-colors duration-150 ease-soft hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-field disabled:text-fg-faint disabled:shadow-none"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="ml-auto flex items-center gap-2">
              <InfoButton onClick={() => setIsInfoOpen(true)} />
              <span className="mx-1 h-6 w-px bg-line" aria-hidden="true" />
              <ThemeToggle theme={appTheme.theme} onToggle={appTheme.toggleTheme} />
            </div>
          )}
        </header>
      )}

      <div className={`grid min-h-0 flex-1 ${layoutClass}`}>
        <section className="flex min-h-0 flex-col">
          {/* On mobile these controls live in the "Data" tab instead */}
          {!isFullscreen && !isMobile && (
            <CandleControls
              params={candleParams}
              onChange={setCandleParams}
              onApply={handleApplyCandleParams}
              onRandomize={handleRandomizeCandles}
            />
          )}
          <div className="relative min-h-0 flex-1">
            <CandleChart colors={editor.colors} candles={candles} />
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <FullscreenToggle
                isFullscreen={isFullscreen}
                onToggle={fullscreen.toggleFullscreen}
              />
              {isMobile && <ThemeNameChip editor={editor} />}
            </div>
          </div>
        </section>

        {!isFullscreen &&
          (isMobile ? (
            <MobilePanel
              editor={editor}
              themes={[...PRESET_THEMES, ...savedThemes.themes]}
              onPickTheme={handlePickTheme}
              onDeleteTheme={handleDelete}
              onRandomizeColors={handleRandomizeCandleColors}
              candleParams={candleParams}
              onCandleParamsChange={setCandleParams}
              onApplyCandles={handleApplyCandleParams}
              onRandomizeCandles={handleRandomizeCandles}
              appTheme={appTheme.theme}
              onToggleAppTheme={appTheme.toggleTheme}
              onOpenInfo={() => setIsInfoOpen(true)}
              onOpenTradingView={() => setIsTradingViewOpen(true)}
            />
          ) : (
            <Sidebar
              editor={editor}
              visibleThemes={visibleThemes}
              totalThemes={PRESET_THEMES.length + savedThemes.themes.length}
              onPickTheme={handlePickTheme}
              onViewAllThemes={() => setIsThemeListOpen(true)}
              onRandomizeColors={handleRandomizeCandleColors}
              onReset={handleReset}
              onSave={handleSave}
              onSaveAsNew={handleSaveAsNew}
              onOpenTradingView={() => setIsTradingViewOpen(true)}
            />
          ))}
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
      {isTradingViewOpen && (
        <TradingViewDialog
          colors={editor.colors}
          themeName={editor.themeName}
          onClose={() => setIsTradingViewOpen(false)}
        />
      )}
      {isInfoOpen && <InfoDialog onClose={() => setIsInfoOpen(false)} />}
    </div>
  );
}
