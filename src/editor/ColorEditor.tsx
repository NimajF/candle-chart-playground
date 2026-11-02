import { useState } from 'react';
import { PaletteIcon } from '@phosphor-icons/react';
import { SectionTitle } from '../ui/SectionTitle';
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
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <SectionTitle icon={PaletteIcon}>Colors</SectionTitle>
        <RandomizeButton
          label={allLocked ? 'Unlock a color to randomize' : 'Randomize colors'}
          onClick={() => onRandomize(locks)}
          isDisabled={allLocked}
        />
      </header>

      <div className="space-y-2">
        {/* One grid: a label column, then up / down columns. Locks sit next to the label they
            control, and the up / down headers are centered over their inputs. */}
        <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-2 gap-y-1.5 text-xs">
          <span className="text-fg-muted">Background</span>
          <ColorField
            label={COLOR_LABELS.background}
            value={colors.background}
            onChange={(color) => onChange('background', color)}
          />
          <div className="justify-self-start">
            <LockToggle
              locked={locks.background}
              label="background"
              onToggle={() => toggleLock('background')}
            />
          </div>

          <span className="mt-2" />
          <span className="mt-2 flex items-center justify-center gap-0.5 text-fg-muted">
            Up
            <LockToggle locked={locks.up} label="up candles" onToggle={() => toggleLock('up')} />
          </span>
          <span className="mt-2 flex items-center justify-center gap-0.5 text-fg-muted">
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

        <p className="text-xs text-fg-faint">Locked groups keep their colors when you randomize.</p>
      </div>
    </section>
  );
}
