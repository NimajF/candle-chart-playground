import type { ThemeColors } from '../../../src/theme/model';
import { COLOR_KEYS } from '../../../src/theme/model';

function toRgb(hex: string): [number, number, number] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
}

function toHex(rgb: readonly number[]): string {
  return `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

export function lerpHex(from: string, to: string, p: number): string {
  const a = toRgb(from);
  const b = toRgb(to);
  return toHex(a.map((c, i) => c + (b[i] - c) * p));
}

export function lerpColors(from: ThemeColors, to: ThemeColors, p: number): ThemeColors {
  return Object.fromEntries(
    COLOR_KEYS.map((key) => [key, lerpHex(from[key], to[key], p)]),
  ) as unknown as ThemeColors;
}

/** Same shape the app's randomizer produces: borders and wicks follow their body color. */
export function palette(background: string, up: string, down: string): ThemeColors {
  return {
    background,
    upBody: up,
    downBody: down,
    upBorder: up,
    downBorder: down,
    upWick: up,
    downWick: down,
  };
}

export function isLight(hex: string): boolean {
  const [r, g, b] = toRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}
