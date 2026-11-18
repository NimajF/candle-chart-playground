import { Composition } from 'remotion';
import { Promo, PROMO_DURATION } from './Promo';
import { Demo, DEMO_DURATION } from './Demo';
import { FPS } from './lib/anim';

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="Promo"
        component={Promo}
        durationInFrames={PROMO_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo"
        component={Demo}
        durationInFrames={DEMO_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
}
