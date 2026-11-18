import { useCurrentFrame } from 'remotion';
import type { CaptionCue } from '../lib/script';
import { progress } from '../lib/anim';
import { T, UI_FONT } from '../lib/tokens';

export function Caption({ cue }: { cue: CaptionCue }) {
  const frame = useCurrentFrame();
  if (frame < cue.from || frame > cue.to) return null;

  const enter = progress(frame, cue.from, 10);
  const exit = progress(frame, cue.to - 8, 8);
  const visible = enter * (1 - exit);

  return (
    <div
      style={{
        position: 'absolute',
        top: 34,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: visible,
        transform: `translateY(${(1 - enter) * -14 + exit * -8}px)`,
        filter: `blur(${(1 - visible) * 6}px)`,
      }}
    >
      <div
        style={{
          padding: '14px 30px',
          borderRadius: 999,
          background: 'rgba(21, 21, 24, 0.86)',
          border: `1px solid ${T.lineStrong}`,
          boxShadow: '0 20px 50px -20px rgba(0,0,0,0.8)',
          fontFamily: UI_FONT,
          fontSize: 40,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: T.fg,
          whiteSpace: 'nowrap',
        }}
      >
        {cue.lead} <span style={{ color: T.accent }}>{cue.accent}</span>
      </div>
    </div>
  );
}
