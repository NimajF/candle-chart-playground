import type { CandleParams } from './types';
import { Slider } from '../ui/Slider';

interface CandleControlsProps {
  params: CandleParams;
  onChange: (newParams: CandleParams) => void;
  onApply: () => void;
  onRandomize: () => void;
}

export function CandleControls({ params, onChange, onApply, onRandomize }: CandleControlsProps) {
  return (
    <section className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
      <header className="flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">Candles</h2>
        <button
          type="button"
          onClick={onRandomize}
          className="cursor-pointer rounded-md border border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-800"
        >
          Randomize
        </button>
      </header>

      <Slider
        label="Trend"
        value={params.drift}
        min={-0.01}
        max={0.01}
        step={0.001}
        display={`${(params.drift * 100).toFixed(1)}% / day`}
        onChange={(drift) => onChange({ ...params, drift })}
      />
      <Slider
        label="Volatility"
        value={params.volatility}
        min={0.002}
        max={0.05}
        step={0.001}
        display={`${(params.volatility * 100).toFixed(1)}%`}
        onChange={(volatility) => onChange({ ...params, volatility })}
      />
      <Slider
        label="Bars"
        value={params.count}
        min={20}
        max={150}
        step={1}
        display={String(params.count)}
        onChange={(count) => onChange({ ...params, count })}
      />
      <button
        type="button"
        onClick={onApply}
        className="w-full cursor-pointer rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 active:bg-emerald-300"
      >
        Apply
      </button>
    </section>
  );
}
