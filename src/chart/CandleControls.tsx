import { ChartLineUpIcon } from '@phosphor-icons/react';
import type { CandleParams } from './types';
import { SectionTitle } from '../ui/SectionTitle';
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
    <div className="flex h-12 shrink-0 items-center gap-6 border-b border-line bg-surface px-4">
      <SectionTitle icon={ChartLineUpIcon}>Sample data</SectionTitle>

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

      <div className="ml-auto flex items-center gap-2">
        <RandomizeButton label="Randomize candles" onClick={onRandomize} />
        <button
          type="button"
          onClick={onApply}
          className="cursor-pointer rounded-control bg-accent px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-fg transition-colors duration-150 ease-soft hover:bg-accent-hover"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
