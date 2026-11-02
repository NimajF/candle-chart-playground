import type { ThemeColors } from '../theme/model';

interface ThemeSwatchProps {
  colors: ThemeColors;
  className?: string;
}

// Five fixed mini candles
const CANDLES = [
  { x: 10, wick: [18, 36], body: [22, 10], up: true },
  { x: 20, wick: [14, 32], body: [17, 10], up: false },
  { x: 30, wick: [10, 28], body: [13, 11], up: true },
  { x: 40, wick: [12, 30], body: [15, 9], up: false },
  { x: 50, wick: [4, 22], body: [7, 11], up: true },
] as const;

export function ThemeSwatch({ colors, className = '' }: ThemeSwatchProps) {
  return (
    <svg
      viewBox="0 0 60 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`shrink-0 rounded-[5px] border border-line ${className}`}
      style={{ backgroundColor: colors.background }}
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
