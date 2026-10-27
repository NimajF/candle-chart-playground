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
    <label className="block space-y-1 text-sm">
      <span className="flex justify-between">
        <span>{label}</span>
        <span className="font-data text-fg-muted">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-accent"
      />
    </label>
  );
}
