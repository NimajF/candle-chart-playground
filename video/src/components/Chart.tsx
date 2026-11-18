// SVG stand-in for the app's lightweight-charts canvas. Drawn from props only, so every video
// frame is deterministic. Same rules as the app: last 100 bars, 5 empty bars on the right,
// axis colors derived from the background, candles revealed left to right.
import type { Candle } from '../../../src/chart/types';
import type { ThemeColors } from '../../../src/theme/model';
import { getAxisColors } from '../../../src/chart/axisColors';
import { isLight } from '../lib/colors';
import { DATA_FONT, UI_FONT } from '../lib/tokens';

interface ChartProps {
  candles: readonly Candle[];
  colors: ThemeColors;
  width: number;
  height: number;
  reveal?: number; // 0..1
  axes?: boolean;
  background?: boolean;
}

const MAX_VISIBLE = 100;
const RIGHT_OFFSET = 5;
const PRICE_AXIS_W = 60;
const TIME_AXIS_H = 28;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function niceStep(rough: number): number {
  const power = 10 ** Math.floor(Math.log10(rough));
  const n = rough / power;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * power;
}

export function Chart({
  candles,
  colors,
  width,
  height,
  reveal = 1,
  axes = true,
  background = true,
}: ChartProps) {
  const axis = getAxisColors(colors.background);
  const visible = candles.slice(-MAX_VISIBLE);
  const shownCount = Math.ceil(reveal * visible.length);

  const plotW = axes ? width - PRICE_AXIS_W : width;
  const plotH = axes ? height - TIME_AXIS_H : height;
  const spacing = plotW / (visible.length + RIGHT_OFFSET);
  const bodyW = Math.max(1, Math.round(spacing * 0.75));

  // Price range is pinned to all visible candles, so the axis doesn't move during the reveal.
  const min = Math.min(...visible.map((c) => c.low));
  const max = Math.max(...visible.map((c) => c.high));
  const top = plotH * 0.2;
  const usable = plotH * 0.7;
  const y = (price: number) => top + ((max - price) / (max - min)) * usable;
  const x = (i: number) => spacing * (i + 0.5);

  // Price labels every ~70px, on round numbers, across the whole plot height.
  const priceAt = (py: number) => max - ((py - top) / usable) * (max - min);
  const step = niceStep((max - min) / (usable / 70));
  const ticks: number[] = [];
  for (let p = Math.floor(priceAt(12) / step) * step; p > priceAt(plotH - 12); p -= step) {
    ticks.push(p);
  }

  const monthStarts = visible.flatMap((c, i) => {
    const prev = visible[i - 1];
    return i > 0 && c.time.slice(5, 7) !== prev.time.slice(5, 7) ? [i] : [];
  });

  const last = shownCount > 0 ? visible[shownCount - 1] : null;
  const lastUp = last ? last.close >= last.open : true;
  const lastColor = lastUp ? colors.upBody : colors.downBody;

  return (
    <svg width={width} height={height} style={{ display: 'block', fontFamily: UI_FONT }}>
      {background && <rect width={width} height={height} fill={colors.background} />}

      {visible.slice(0, shownCount).map((c, i) => {
        const up = c.close >= c.open;
        const bodyTop = y(Math.max(c.open, c.close));
        const bodyH = Math.max(1, Math.abs(y(c.open) - y(c.close)));
        const cx = Math.round(x(i)) + 0.5;
        return (
          <g key={c.time}>
            <line
              x1={cx}
              x2={cx}
              y1={y(c.high)}
              y2={y(c.low)}
              stroke={up ? colors.upWick : colors.downWick}
              strokeWidth={1}
            />
            <rect
              x={cx - bodyW / 2}
              y={bodyTop}
              width={bodyW}
              height={bodyH}
              fill={up ? colors.upBody : colors.downBody}
              stroke={up ? colors.upBorder : colors.downBorder}
              strokeWidth={1}
            />
          </g>
        );
      })}

      {axes && (
        <>
          <line x1={plotW + 0.5} x2={plotW + 0.5} y1={0} y2={plotH} stroke={axis.border} />
          <line x1={0} x2={width} y1={plotH + 0.5} y2={plotH + 0.5} stroke={axis.border} />

          {ticks.map((p) => (
            <text
              key={p}
              x={plotW + 8}
              y={y(p) + 4}
              fill={axis.text}
              fontSize={12}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {p.toFixed(2)}
            </text>
          ))}

          {monthStarts.map((i) => {
            const month = Number(visible[i].time.slice(5, 7)) - 1;
            return (
              <text
                key={i}
                x={x(i)}
                y={plotH + 18}
                fill={axis.text}
                fontSize={12}
                textAnchor="middle"
              >
                {MONTHS[month]}
              </text>
            );
          })}

          {last && (
            <>
              <line
                x1={0}
                x2={plotW}
                y1={y(last.close)}
                y2={y(last.close)}
                stroke={lastColor}
                strokeDasharray="2 3"
              />
              <rect
                x={plotW}
                y={y(last.close) - 10}
                width={PRICE_AXIS_W}
                height={20}
                fill={lastColor}
              />
              <text
                x={plotW + 8}
                y={y(last.close) + 4}
                fill={isLight(lastColor) ? '#000000' : '#FFFFFF'}
                fontSize={12}
                fontFamily={DATA_FONT}
              >
                {last.close.toFixed(2)}
              </text>
            </>
          )}
        </>
      )}
    </svg>
  );
}
