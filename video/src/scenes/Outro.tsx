import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Swatch } from '../components/Swatch';
import { progress } from '../lib/anim';
import { FINAL_COLORS } from '../lib/script';
import { DATA_FONT, T, UI_FONT } from '../lib/tokens';

export const OUTRO_DURATION = 95;

export function Outro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bg = progress(frame, 0, 12);
  const logo = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 140 } });
  const line = (start: number) => {
    const p = progress(frame, start, 14);
    return { opacity: p, transform: `translateY(${(1 - p) * 24}px)` };
  };

  return (
    <AbsoluteFill style={{ background: T.canvas, opacity: bg }}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: UI_FONT,
          textAlign: 'center',
        }}
      >
        <div style={{ transform: `scale(${logo})`, marginBottom: 44 }}>
          <Swatch colors={FINAL_COLORS} width={210} height={140} radius={22} />
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            letterSpacing: '-0.035em',
            color: T.fg,
            ...line(14),
          }}
        >
          Candle Theme Playground
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 34,
            fontFamily: DATA_FONT,
            color: T.accent,
            ...line(22),
          }}
        >
          candle-chart-playground.vercel.app
        </div>
        <div
          style={{ marginTop: 26, fontSize: 26, fontWeight: 500, color: T.fgMuted, ...line(30) }}
        >
          Free · No sign-up · Runs in your browser
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
