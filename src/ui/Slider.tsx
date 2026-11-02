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
      <span className="text-fg-muted">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 cursor-pointer accent-accent-ink"
      />
      <span className="min-w-[6ch] font-data text-xs text-fg tabular-nums">{display}</span>
    </label>
  );
}
