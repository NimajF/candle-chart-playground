import { useState } from 'react';
import { COLOR_LABELS, type ColorKey, type ThemeColors } from '../theme/model';
import { RandomizeButton } from '../ui/RandomizeButton';
import { ColorField } from './ColorField';
import { LockToggle } from '../ui/LockToggle';
import type { ColorLocks } from '../theme/randomColors';

interface ColorEditorProps {
  colors: ThemeColors;
  onChange: (key: ColorKey, color: string) => void;
  onRandomize: (locks: ColorLocks) => void;
}

// Each candle part has an up and a down color, shown side by side.
const CANDLE_ROWS: { label: string; up: ColorKey; down: ColorKey }[] = [
  { label: 'Body', up: 'upBody', down: 'downBody' },
  { label: 'Border', up: 'upBorder', down: 'downBorder' },
  { label: 'Wick', up: 'upWick', down: 'downWick' },
];

export function ColorEditor({ colors, onChange, onRandomize }: ColorEditorProps) {
  const [locks, setLocks] = useState<ColorLocks>({ background: false, up: false, down: false });

  function toggleLock(key: keyof ColorLocks) {
    setLocks((prev) => ({ ...prev, [key]: !prev[key] })); // Toggle the lock state for the given key
  }

  // With everything locked there is nothing left to randomize.
  const allLocked = locks.background && locks.up && locks.down;

  return (
    <section className="space-y-3 rounded-panel border border-line bg-surface p-3 shadow-panel">
      <header className="flex items-center justify-between">
        <h2 className="text-label text-fg-faint uppercase">Colors</h2>
        <RandomizeButton
          label={allLocked ? 'Unlock a color to randomize' : 'Randomize colors'}
          onClick={() => onRandomize(locks)}
          isDisabled={allLocked}
        />
      </header>

      <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-x-2 gap-y-2 text-sm">
        <span className="text-fg-muted">Background</span>
        <ColorField
          label={COLOR_LABELS.background}
          value={colors.background}
          onChange={(color) => onChange('background', color)}
        />
        <span className="flex">
          <LockToggle
            locked={locks.background}
            label="background"
            onToggle={() => toggleLock('background')}
          />
        </span>

        <span />
        <span className="mt-2 flex items-center gap-1 text-label text-fg-faint uppercase">
          Up
          <LockToggle locked={locks.up} label="up candles" onToggle={() => toggleLock('up')} />
        </span>
        <span className="mt-2 flex items-center gap-1 text-label text-fg-faint uppercase">
          Down
          <LockToggle
            locked={locks.down}
            label="down candles"
            onToggle={() => toggleLock('down')}
          />
        </span>

        {CANDLE_ROWS.map((row) => (
          <div key={row.label} className="contents">
            <span className="text-fg-muted">{row.label}</span>
            <ColorField
              label={COLOR_LABELS[row.up]}
              value={colors[row.up]}
              onChange={(color) => onChange(row.up, color)}
            />
            <ColorField
              label={COLOR_LABELS[row.down]}
              value={colors[row.down]}
              onChange={(color) => onChange(row.down, color)}
              popoverAlign="right"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
