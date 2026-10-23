import { useState } from 'react';
import { COLOR_KEYS, COLOR_LABELS, type Theme } from './theme/model';
import { CandleChart } from './chart/CandleChart';
import { PresetPicker } from './editor/PresetPicker';
import { ColorField } from './editor/ColorField';
import { CandleControls } from './chart/CandleControls';
import { useThemeEditor } from './editor/useThemeEditor';
import { useSavedThemes } from './saved-themes/useSavedThemes';
import type { Candle, CandleParams } from './chart/types';
import { SAMPLE_CANDLES } from './chart/data';
import {
  DEFAULT_CANDLE_PARAMS,
  generateCandles,
  generateRandomCandlesParams,
} from './chart/generateCandles';
import { PRESET_THEMES, isPresetId, presetAsCopy } from './theme/presets';

export default function App() {
  const [candles, setCandles] = useState<readonly Candle[]>(SAMPLE_CANDLES);
  const [candleParams, setCandleParams] = useState<CandleParams>(DEFAULT_CANDLE_PARAMS);
  const editor = useThemeEditor(presetAsCopy(PRESET_THEMES[0]));
  const savedThemes = useSavedThemes();

  function handleSave() {
    const theme: Theme = {
      id: isPresetId(editor.base.id) ? crypto.randomUUID() : editor.base.id,
      name: editor.themeName.trim() || 'Untitled Theme',
      colors: editor.colors,
    };
    savedThemes.saveTheme(theme);
    editor.loadTheme(theme);
  }

  function handleRandomizeCandles() {
    const randomParams = generateRandomCandlesParams();
    setCandleParams(randomParams);
    setCandles(generateCandles(randomParams));
  }

  // Generates new candles based on the current candleParams state
  function handleApplyCandleParams() {
    setCandles(generateCandles(candleParams));
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100 lg:grid lg:grid-cols-[1fr_22rem]">
      <section className="sticky top-0 z-10 h-[45dvh] border-b border-zinc-800 bg-zinc-950 p-4 lg:h-dvh lg:border-r lg:border-b-0">
        <div className="h-full overflow-hidden rounded-lg">
          <CandleChart colors={editor.colors} candles={candles} />
        </div>
      </section>

      <aside className="space-y-4 p-4">
        <h1 className="text-lg font-semibold">Theme Playground</h1>
        <PresetPicker
          presets={PRESET_THEMES}
          activeId={editor.base.id}
          onSelect={(preset) => editor.loadTheme(presetAsCopy(preset))}
        />
        <input
          type="text"
          value={editor.themeName}
          onChange={(e) => editor.setThemeName(e.target.value)}
          placeholder="Theme Name"
          aria-label="Theme name"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-2.5 text-sm font-medium tracking-wide text-zinc-100 shadow-sm shadow-black/20 outline-none transition-all duration-200 placeholder:text-zinc-500 hover:border-zinc-500 hover:bg-zinc-900 focus:border-emerald-400 focus:bg-zinc-900 focus:ring-4 focus:ring-emerald-400/15 active:border-emerald-300"
        />
        <CandleControls
          params={candleParams}
          onChange={setCandleParams}
          onApply={handleApplyCandleParams}
          onRandomize={handleRandomizeCandles}
        />
        <ul className="space-y-2">
          {COLOR_KEYS.map((key) => (
            <li key={key}>
              <ColorField
                label={COLOR_LABELS[key]}
                value={editor.colors[key]}
                onChange={(color) => editor.setColor(key, color)}
              />
            </li>
          ))}
        </ul>
        <button type="button" onClick={handleSave}>
          Save
        </button>
      </aside>
    </div>
  );
}
