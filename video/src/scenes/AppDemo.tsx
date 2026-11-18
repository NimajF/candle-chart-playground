import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { AppMock } from '../components/AppMock';
import { Caption } from '../components/Caption';
import { Cursor } from '../components/Cursor';
import { progress } from '../lib/anim';
import {
  ALL_CLICKS,
  APP_H,
  APP_SCALE,
  CAPTIONS,
  CURSOR_VISIBLE,
  WINDOW,
  cameraAt,
  cursorAt,
  isDragging,
} from '../lib/script';
import { DATA_FONT, T } from '../lib/tokens';

function BrowserChrome() {
  return (
    <div
      style={{
        height: WINDOW.chrome,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        background: '#111114',
        borderBottom: `1px solid ${T.line}`,
      }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <span
            key={c}
            style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.85 }}
          />
        ))}
      </div>
      <div
        style={{
          margin: '0 auto',
          padding: '5px 18px',
          borderRadius: 8,
          background: T.field,
          color: T.fgMuted,
          fontFamily: DATA_FONT,
          fontSize: 14,
        }}
      >
        candle-chart-playground.vercel.app
      </div>
      <div style={{ width: 52 }} />
    </div>
  );
}

export function AppDemo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 26 });
  const camera = cameraAt(frame);
  const [cx, cy] = cursorAt(frame);
  const lastClick = [...ALL_CLICKS].reverse().find((c) => c <= frame);
  const cursorOpacity =
    progress(frame, CURSOR_VISIBLE[0], 8) * (1 - progress(frame, CURSOR_VISIBLE[1], 8));

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transformOrigin: '0 0',
          transform: `translate(${960 - camera.x * camera.zoom}px, ${540 - camera.y * camera.zoom}px) scale(${camera.zoom})`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: WINDOW.x,
            top: WINDOW.y,
            width: WINDOW.w,
            height: WINDOW.chrome + APP_H * APP_SCALE,
            borderRadius: 14,
            overflow: 'hidden',
            border: `1px solid ${T.lineStrong}`,
            boxShadow: '0 50px 120px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.03)',
            opacity: enter,
            transform: `translateY(${(1 - enter) * 60}px) scale(${0.96 + 0.04 * enter})`,
          }}
        >
          <BrowserChrome />
          <div style={{ transformOrigin: '0 0', transform: `scale(${APP_SCALE})` }}>
            <AppMock frame={frame} />
          </div>
        </div>

        <Cursor
          x={cx}
          y={cy}
          opacity={cursorOpacity}
          pressed={isDragging(frame) || (lastClick !== undefined && frame - lastClick < 5)}
          clickAge={lastClick === undefined ? null : frame - lastClick}
        />
      </AbsoluteFill>

      {CAPTIONS.map((cue) => (
        <Caption key={cue.from} cue={cue} />
      ))}
    </AbsoluteFill>
  );
}
