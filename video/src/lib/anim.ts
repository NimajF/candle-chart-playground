import { Easing } from 'remotion';

export const FPS = 30;

export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.2, 0.7, 0.2, 1); // the app's --ease-soft

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** 0 → 1 over `duration` frames starting at `start`. */
export function progress(frame: number, start: number, duration: number, ease = easeOut): number {
  return ease(clamp01((frame - start) / duration));
}

/** Piecewise interpolation through [frame, value] keyframes, eased per segment, held at the ends. */
export function track(frame: number, keys: readonly (readonly [number, number])[]): number {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i];
    if (frame <= t1) {
      const [t0, v0] = keys[i - 1];
      const p = t1 === t0 ? 1 : easeInOut((frame - t0) / (t1 - t0));
      return v0 + (v1 - v0) * p;
    }
  }
  return keys[keys.length - 1][1];
}

/** A quick 1 → 0.94 → 1 squeeze right after a click. */
export function pressScale(frame: number, clicks: readonly number[]): number {
  for (const c of clicks) {
    const d = frame - c;
    if (d >= 0 && d < 6) return 1 - 0.06 * Math.sin((Math.PI * d) / 6);
  }
  return 1;
}

/** A small pop (1 → 1.25 → 1) after `start`. */
export function pop(frame: number, start: number): number {
  const d = frame - start;
  return d >= 0 && d < 8 ? 1 + 0.25 * Math.sin((Math.PI * d) / 8) : 1;
}
