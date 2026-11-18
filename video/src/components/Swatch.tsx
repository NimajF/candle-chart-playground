// Same five mini candles as the app's ThemeSwatch (src/editor/ThemeSwatch.tsx).
import type { ThemeColors } from '../../../src/theme/model';
import { T } from '../lib/tokens';

const CANDLES = [
  { x: 10, wick: [18, 36], body: [22, 10], up: true },
  { x: 20, wick: [14, 32], body: [17, 10], up: false },
  { x: 30, wick: [10, 28], body: [13, 11], up: true },
  { x: 40, wick: [12, 30], body: [15, 9], up: false },
  { x: 50, wick: [4, 22], body: [7, 11], up: true },
] as const;

interface SwatchProps {
  colors: ThemeColors;
  width: number;
  height: number;
  radius?: number;
}

export function Swatch({ colors, width, height, radius = 5 }: SwatchProps) {
  return (
    <svg
      viewBox="0 0 60 40"
      preserveAspectRatio="none"
      width={width}
      height={height}
      style={{
        display: 'block',
        flexShrink: 0,
        backgroundColor: colors.background,
        borderRadius: radius,
        border: `1px solid ${T.line}`,
      }}
    >
      {CANDLES.map(({ x, wick, body, up }) => (
        <g key={x}>
          <line
            x1={x}
            x2={x}
            y1={wick[0]}
            y2={wick[1]}
            stroke={up ? colors.upWick : colors.downWick}
            strokeWidth={1.5}
          />
          <rect
            x={x - 2.5}
            y={body[0]}
            width={5}
            height={body[1]}
            fill={up ? colors.upBody : colors.downBody}
            stroke={up ? colors.upBorder : colors.downBorder}
          />
        </g>
      ))}
    </svg>
  );
}
