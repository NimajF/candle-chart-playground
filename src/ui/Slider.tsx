interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}

export function Slider({ label, value, min, max, step, display, onChange }: SliderProps) {
  return (
    <label className="flex items-center gap-2 text-sm whitespace-nowrap">
      <span className="text-fg-muted max-md:w-20">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--fill': `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties}
        className="slider w-24 max-md:w-auto max-md:flex-1"
      />
      <span className="min-w-[6ch] text-xs font-medium text-fg tabular-nums">{display}</span>
    </label>
  );
}
