import type { CandleParams } from './types';
import { Slider } from '../ui/Slider';
import { RandomizeButton } from '../ui/RandomizeButton';

interface CandleControlsProps {
  params: CandleParams;
  onChange: (newParams: CandleParams) => void;
  onApply: () => void;
  onRandomize: () => void;
}

export function CandleControls({ params, onChange, onApply, onRandomize }: CandleControlsProps) {
  return (
    <section className="space-y-4 rounded-panel border border-line bg-surface p-3 shadow-panel">
      <header className="flex items-center justify-between">
        <h2 className="text-label text-fg-faint uppercase">Candles</h2>
        <RandomizeButton label="Randomize candles" onClick={onRandomize} />
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
        className="w-full cursor-pointer rounded-control bg-accent px-3 py-2 text-sm font-semibold text-accent-fg transition-colors duration-150 ease-soft hover:bg-accent-hover"
      >
        Apply
      </button>
    </section>
  );
}
