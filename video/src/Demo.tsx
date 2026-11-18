// The app demo on its own (no title or outro), for the landing hero. Fades out at the end so the
// looping <video> doesn't cut hard from the saved theme back to the starting one.
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Backdrop } from './Promo';
import { AppDemo } from './scenes/AppDemo';
import { APP_DURATION } from './lib/script';
import { progress } from './lib/anim';
import { T } from './lib/tokens';

export const DEMO_DURATION = APP_DURATION;

export function Demo() {
  const frame = useCurrentFrame();
  const fade = 1 - progress(frame, DEMO_DURATION - 14, 14);

  return (
    <AbsoluteFill style={{ background: T.canvas }}>
      <Backdrop />
      <AbsoluteFill style={{ opacity: fade }}>
        <AppDemo />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
