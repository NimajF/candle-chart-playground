import { COLOR_KEYS, COLOR_LABELS } from './theme/model';
import { CandleChart } from './chart/CandleChart';
import { SAMPLE_CANDLES } from './chart/data';
import { PRESET_THEMES } from './theme/presets';

export default function App() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100 lg:grid lg:grid-cols-[1fr_22rem]">
      <section className="sticky top-0 z-10 h-[45dvh] border-b border-zinc-800 bg-zinc-950 p-4 lg:h-dvh lg:border-r lg:border-b-0">
        <div className="h-full overflow-hidden rounded-lg">
          <CandleChart colors={PRESET_THEMES[0].colors} candles={SAMPLE_CANDLES} />
        </div>
      </section>

      <aside className="space-y-4 p-4">
        <h1 className="text-lg font-semibold">Theme Playground</h1>
        <ul className="space-y-2">
          {COLOR_KEYS.map((key) => (
            <li key={key} className="flex items-center justify-between text-sm">
              <span>{COLOR_LABELS[key]}</span>
              <span className="font-mono text-zinc-500">#------</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
