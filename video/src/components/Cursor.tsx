import { T } from '../lib/tokens';

interface CursorProps {
  x: number;
  y: number;
  opacity: number;
  pressed: boolean;
  clickAge: number | null; // frames since the latest click, for the ripple
}

const RIPPLE_FRAMES = 14;

export function Cursor({ x, y, opacity, pressed, clickAge }: CursorProps) {
  const ripple = clickAge !== null && clickAge < RIPPLE_FRAMES ? clickAge / RIPPLE_FRAMES : null;

  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity, pointerEvents: 'none' }}>
      {ripple !== null && (
        <div
          style={{
            position: 'absolute',
            left: -30,
            top: -30,
            width: 60,
            height: 60,
            borderRadius: '50%',
            border: `3px solid ${T.accent}`,
            transform: `scale(${0.2 + ripple * 0.8})`,
            opacity: 1 - ripple,
          }}
        />
      )}
      <svg
        width={26}
        height={32}
        viewBox="0 0 26 32"
        style={{
          position: 'absolute',
          left: -3,
          top: -2,
          transform: `scale(${pressed ? 0.86 : 1})`,
          transformOrigin: '3px 2px',
          filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))',
        }}
      >
        <path
          d="M3 2 L3 25 L9 19.5 L13 29 L17 27.3 L13 18 L21 18 Z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
