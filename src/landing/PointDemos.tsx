// Three small live demonstrations of the product's core moves. They are drawn from the same
// palettes and the same icons the playground uses, so nothing here is a stand-in for the real thing.
import { useState } from 'react';
import {
  CheckIcon,
  CopyIcon,
  DiceFiveIcon,
  LockSimpleIcon,
  LockSimpleOpenIcon,
} from '@phosphor-icons/react';
import { generateCandles } from '../chart/generateCandles';
import { PALETTES, type CandlePalette } from './palettes';
import { useCycle } from './usePaletteCycle';

const TILE_W = 232;
const TILE_H = 132;
const TILE_CANDLES = 15;

function useTileCandles() {
  const [candles] = useState(() =>
    generateCandles({ count: TILE_CANDLES, drift: 0.012, volatility: 0.03 }),
  );
  return candles;
}

interface TileProps {
  palette: CandlePalette;
  upColor?: string; // when set, the up candles ignore the palette (they are locked)
}

function ChartTile({ palette, upColor }: TileProps) {
  const candles = useTileCandles();
  const min = Math.min(...candles.map((c) => c.low));
  const max = Math.max(...candles.map((c) => c.high));
  const y = (price: number) => 14 + ((max - price) / (max - min)) * (TILE_H - 28);
  const step = TILE_W / TILE_CANDLES;

  return (
    <svg
      width={TILE_W}
      height={TILE_H}
      viewBox={`0 0 ${TILE_W} ${TILE_H}`}
      className="tint block max-w-full rounded-card border border-line-strong"
      style={{ backgroundColor: palette.background }}
      aria-hidden="true"
    >
      {candles.map((c, i) => {
        const up = c.close >= c.open;
        const color = up ? (upColor ?? palette.up) : palette.down;
        const cx = step * (i + 0.5);
        return (
          <g key={c.time}>
            <line
              x1={cx}
              x2={cx}
              y1={y(c.high)}
              y2={y(c.low)}
              strokeWidth={1.25}
              className="tint"
              style={{ stroke: color }}
            />
            <rect
              x={cx - 4}
              y={y(Math.max(c.open, c.close))}
              width={8}
              height={Math.max(1.5, Math.abs(y(c.open) - y(c.close)))}
              className="tint"
              style={{ fill: color }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// Shuffle: the whole palette changes on every roll, the dice spins like the app's button.
export function ShuffleDemo() {
  const index = useCycle(PALETTES.length, 2200, 1);
  const palette = PALETTES[index];

  return (
    <div className="flex flex-col items-start gap-3">
      <ChartTile palette={palette} />
      <div className="flex items-center gap-2 rounded-control border border-line-strong bg-field px-3 py-1.5 text-xs font-semibold tracking-wide text-fg">
        <DiceFiveIcon
          size={18}
          weight="bold"
          className="text-accent-ink transition-transform duration-500 ease-soft"
          style={{ transform: `rotate(${index * 180 - 12}deg)` }}
        />
        Randomize
      </div>
    </div>
  );
}

// Lock: the up candles stay put while the background and the down candles keep changing.
export function LockDemo() {
  const index = useCycle(PALETTES.length, 2200, 2);
  const palette = PALETTES[index];
  const locked = PALETTES[0].up;

  const chips = [
    { label: 'Background', locked: false },
    { label: 'Up', locked: true },
    { label: 'Down', locked: false },
  ];

  return (
    <div className="flex flex-col items-start gap-3">
      <ChartTile palette={palette} upColor={locked} />
      <div className="flex items-center gap-1.5">
        {chips.map(({ label, locked: isLocked }) => {
          const LockIcon = isLocked ? LockSimpleIcon : LockSimpleOpenIcon;
          return (
            <span
              key={label}
              className={`flex items-center gap-1 rounded-control border px-2 py-1 text-xs ${
                isLocked
                  ? 'border-accent-line bg-accent-soft font-semibold text-accent-ink'
                  : 'border-line text-fg-faint'
              }`}
            >
              <LockIcon size={14} weight={isLocked ? 'fill' : 'regular'} />
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

const COPY_ROWS = [
  { label: 'Up body', hex: '#FFB020' },
  { label: 'Down body', hex: '#7C5CFF' },
  { label: 'Background', hex: '#14213D' },
] as const;

// Copy: each field copies its hex on click (it really does), and one row demos it on a loop.
export function CopyDemo() {
  const autoIndex = useCycle(COPY_ROWS.length, 1800);
  const [pressed, setPressed] = useState<string | null>(null);

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      // Clipboard can be blocked; the visual confirmation is still fine as a demo.
    }
    setPressed(hex);
    setTimeout(() => setPressed((current) => (current === hex ? null : current)), 1500);
  }

  return (
    <div className="flex w-full max-w-[232px] flex-col gap-2">
      {COPY_ROWS.map(({ label, hex }, i) => {
        const done = pressed === hex || (pressed === null && autoIndex === i);
        return (
          <button
            key={hex}
            type="button"
            onClick={() => copy(hex)}
            aria-label={`Copy ${label} color ${hex}`}
            className={`flex cursor-pointer items-center gap-2 rounded-control border bg-field p-1.5 text-left transition-colors duration-300 ease-soft focus-visible:ring-4 focus-visible:ring-accent-soft focus-visible:outline-none ${
              done ? 'border-accent-line' : 'border-line hover:border-line-strong'
            }`}
          >
            <span
              className="size-5 shrink-0 rounded-md border border-line-strong"
              style={{ backgroundColor: hex }}
            />
            <span className="font-data text-xs text-fg">{hex}</span>
            <span className="ml-auto text-xs text-fg-faint">{label}</span>
            <span
              className={`grid size-5 place-items-center ${done ? 'text-accent-ink' : 'text-fg-muted'}`}
            >
              {done ? <CheckIcon size={16} weight="bold" /> : <CopyIcon size={16} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
