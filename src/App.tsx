import { COLOR_KEYS, COLOR_LABELS } from './theme/model';
import { CandleChart } from './chart/CandleChart';
import { PresetPicker } from './editor/PresetPicker';
import { ColorField } from './editor/ColorField';
import { useThemeEditor } from './editor/useThemeEditor';
import { SAMPLE_CANDLES } from './chart/data';
import { PRESET_THEMES } from './theme/presets';

export default function App() {
  const editor = useThemeEditor(PRESET_THEMES[0]);
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100 lg:grid lg:grid-cols-[1fr_22rem]">
      <section className="sticky top-0 z-10 h-[45dvh] border-b border-zinc-800 bg-zinc-950 p-4 lg:h-dvh lg:border-r lg:border-b-0">
        <div className="h-full overflow-hidden rounded-lg">
          <CandleChart colors={editor.colors} candles={SAMPLE_CANDLES} />
        </div>
      </section>

      <aside className="space-y-4 p-4">
        <h1 className="text-lg font-semibold">Theme Playground</h1>
        <PresetPicker
          presets={PRESET_THEMES}
          activeId={editor.base.id}
          onSelect={editor.loadTheme}
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
      </aside>
    </div>
  );
}
