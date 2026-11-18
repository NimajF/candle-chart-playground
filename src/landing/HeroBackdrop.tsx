import { useState } from 'react';
import { generateCandles } from '../chart/generateCandles';
import { PALETTES } from './palettes';
import { useCycle } from './usePaletteCycle';

const COUNT = 84;
const W = 1200;
const H = 520;
const STEP = W / COUNT;
const BODY = 7;

export function HeroBackdrop() {
  const [candles] = useState(() =>
    generateCandles({ count: COUNT, drift: 0.004, volatility: 0.028 }),
  );
  const palette = PALETTES[useCycle(PALETTES.length, 3200)];

  const min = Math.min(...candles.map((c) => c.low));
  const max = Math.max(...candles.map((c) => c.high));
  const y = (price: number) => 40 + ((max - price) / (max - min)) * (H - 80);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-140 overflow-hidden opacity-[0.3]"
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent 0%, #000 25%, #000 60%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, #000 25%, #000 60%, transparent 100%)',
      }}
    >
      <svg
        className="candles-reveal h-full w-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{
          maskImage: 'radial-gradient(ellipse 48% 62% at 50% 46%, transparent 30%, #000 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 48% 62% at 50% 46%, transparent 30%, #000 100%)',
        }}
      >
        {candles.map((c, i) => {
          const up = c.close >= c.open;
          const color = up ? palette.up : palette.down;
          const cx = STEP * (i + 0.5);
          const top = y(Math.max(c.open, c.close));
          const height = Math.max(1.5, Math.abs(y(c.open) - y(c.close)));
          return (
            <g key={c.time}>
              <line
                x1={cx}
                x2={cx}
                y1={y(c.high)}
                y2={y(c.low)}
                strokeWidth={1.5}
                className="tint"
                style={{ stroke: color }}
              />
              <rect
                x={cx - BODY / 2}
                y={top}
                width={BODY}
                height={height}
                className="tint"
                style={{ fill: color }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
