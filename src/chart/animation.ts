import { COLOR_KEYS, type ThemeColors } from '../theme/model';

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Calls onFrame(progress) every frame with an eased progress from 0 to 1 (1 is delivered last).
// Returns a function that cancels the animation.
export function runAnimation(durationMs: number, onFrame: (progress: number) => void): () => void {
  const start = performance.now();
  let frameId = 0;

  function tick(now: number) {
    const t = Math.min((now - start) / durationMs, 1);
    onFrame(easeOutCubic(t));
    if (t < 1) frameId = requestAnimationFrame(tick);
  }
  frameId = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(frameId);
}

const HEX = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

function lerpHex(from: string, to: string, t: number): string {
  const a = HEX.exec(from);
  const b = HEX.exec(to);
  if (!a || !b) return to;

  const channel = (i: number) => {
    const x = parseInt(a[i], 16);
    const y = parseInt(b[i], 16);
    return Math.round(x + (y - x) * t)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${channel(1)}${channel(2)}${channel(3)}`;
}

export function lerpColors(from: ThemeColors, to: ThemeColors, t: number): ThemeColors {
  const result = {} as Record<(typeof COLOR_KEYS)[number], string>;
  for (const key of COLOR_KEYS) result[key] = lerpHex(from[key], to[key], t);
  return result;
}

export function countChangedColors(a: ThemeColors, b: ThemeColors): number {
  return COLOR_KEYS.filter((key) => a[key] !== b[key]).length;
}
