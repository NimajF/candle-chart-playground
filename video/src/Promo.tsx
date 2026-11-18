import { AbsoluteFill, Sequence } from 'remotion';
import { AppDemo } from './scenes/AppDemo';
import { INTRO_DURATION, Intro } from './scenes/Intro';
import { OUTRO_DURATION, Outro } from './scenes/Outro';
import { APP_DURATION } from './lib/script';
import { T } from './lib/tokens';

const APP_START = INTRO_DURATION - 10; // the window rises while the title fades out
const OUTRO_START = APP_START + APP_DURATION - 10;

export const PROMO_DURATION = OUTRO_START + OUTRO_DURATION;

export function Backdrop() {
  return (
    <AbsoluteFill
      style={{
        background: [
          'radial-gradient(1100px 520px at 50% 115%, rgba(198,242,78,0.10), transparent 70%)',
          'radial-gradient(900px 500px at 8% -10%, rgba(124,92,255,0.10), transparent 70%)',
          T.canvas,
        ].join(', '),
      }}
    />
  );
}

export function Promo() {
  return (
    <AbsoluteFill style={{ background: T.canvas }}>
      <Backdrop />
      <Sequence from={APP_START} durationInFrames={APP_DURATION}>
        <AppDemo />
      </Sequence>
      <Sequence durationInFrames={INTRO_DURATION}>
        <Intro />
      </Sequence>
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_DURATION}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
}
