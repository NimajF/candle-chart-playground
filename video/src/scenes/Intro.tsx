import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { generateCandles } from '../../../src/chart/generateCandles';
import { PRESET_THEMES } from '../../../src/theme/presets';
import { Chart } from '../components/Chart';
import { progress } from '../lib/anim';
import { withSeed } from '../lib/seeded';
import { T, UI_FONT } from '../lib/tokens';

export const INTRO_DURATION = 80;

const CANDLES = withSeed(3, () => generateCandles({ count: 100, drift: 0.004, volatility: 0.02 }));

export function Intro() {
  const frame = useCurrentFrame();
  const fadeOut = 1 - progress(frame, INTRO_DURATION - 12, 12);
  const line = (start: number) => {
    const p = progress(frame, start, 16);
    return {
      opacity: p,
      transform: `translateY(${(1 - p) * 30}px)`,
      filter: `blur(${(1 - p) * 10}px)`,
    };
  };

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <AbsoluteFill style={{ top: 470, opacity: 0.3 }}>
        <Chart
          candles={CANDLES}
          colors={PRESET_THEMES[0].colors}
          width={1920}
          height={610}
          reveal={progress(frame, 0, 40)}
          axes={false}
          background={false}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, ${T.canvas} 30%, transparent 65%, ${T.canvas} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 120,
          fontFamily: UI_FONT,
          textAlign: 'center',
          letterSpacing: '-0.035em',
        }}
      >
        <div style={{ fontSize: 104, fontWeight: 700, color: T.fg, lineHeight: 1.05, ...line(6) }}>
          Design candlestick themes
        </div>
        <div
          style={{ fontSize: 104, fontWeight: 700, color: T.accent, lineHeight: 1.05, ...line(14) }}
        >
          in seconds.
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 32,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            color: T.fgMuted,
            ...line(24),
          }}
        >
          Shuffle palettes, lock the colors you love, copy the hex.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
