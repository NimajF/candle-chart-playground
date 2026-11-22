import type { ReactNode } from 'react';
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
  leadingActions?: ReactNode; // extra buttons on the left of the actions row (mobile uses it)
}

export function CandleControls({
  params,
  onChange,
  onApply,
  onRandomize,
  leadingActions,
}: CandleControlsProps) {
  return (
    // Desktop: a bar above the chart. Mobile: a stacked list inside the "Data" tab.
    <div className="flex min-h-12 shrink-0 flex-wrap items-center gap-x-6 gap-y-2 border-b border-line bg-surface px-4 py-2 max-md:flex-col max-md:items-stretch max-md:gap-y-4 max-md:border-b-0 max-md:p-0">
      {/* On mobile the tab bar already names the section */}
      <div className="max-md:hidden">
        <SectionTitle icon={ChartLineUpIcon}>
          <span className="whitespace-nowrap">Sample data</span>
        </SectionTitle>
      </div>

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

      <div className="ml-auto flex shrink-0 items-center gap-2 max-md:ml-0">
        {leadingActions}
        {/* ml-auto keeps these on the right even when leadingActions fill the left side */}
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
    </div>
  );
}
