import { randomBetween } from '../utils/random';
import { hslToHex } from '../utils/hslToHex';
import type { ThemeColors } from './model';

// Locks for each color in the theme. If a color is locked, it will not be randomized when generating a new random theme.
export interface ColorLocks {
  background: boolean;
  up: boolean;
  down: boolean;
}

type Range = readonly [number, number];

// A "flavor" of color. Each roll picks one flavor first, then rolls values inside it.
// Rolling saturation and lightness freely gives mostly pastel and dull colors, so flavors keep variety on purpose.
interface ColorStyle {
  saturation: Range;
  lightness: Range;
}

const BACKGROUND_STYLES: readonly ColorStyle[] = [
  { saturation: [0, 15], lightness: [4, 12] }, // near black
  { saturation: [35, 75], lightness: [10, 28] }, // deep tinted dark (navy, wine, forest)
  { saturation: [0, 10], lightness: [94, 98] }, // near white
  { saturation: [25, 60], lightness: [88, 96] }, // tinted light (cream, mint)
  { saturation: [30, 70], lightness: [35, 65] }, // bold mid-tone
];

const BODY_STYLES: readonly ColorStyle[] = [
  { saturation: [75, 100], lightness: [45, 60] }, // vivid
  { saturation: [90, 100], lightness: [50, 65] }, // neon
  { saturation: [30, 55], lightness: [65, 82] }, // pastel
  { saturation: [20, 45], lightness: [35, 55] }, // muted
  { saturation: [60, 100], lightness: [20, 38] }, // deep
];

function pickOne<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomColor(styles: readonly ColorStyle[]): string {
  const style = pickOne(styles);
  return hslToHex(
    randomBetween(0, 360),
    randomBetween(...style.saturation),
    randomBetween(...style.lightness),
  );
}

export function generateRandomCandlesColors(
  currentTheme: ThemeColors,
  locks: ColorLocks,
): ThemeColors {
  const background = locks.background ? currentTheme.background : randomColor(BACKGROUND_STYLES);

  // Up and down are fully independent: each one picks its own flavor, hue, saturation and lightness.
  const upBody = locks.up ? currentTheme.upBody : randomColor(BODY_STYLES);
  const downBody = locks.down ? currentTheme.downBody : randomColor(BODY_STYLES);

  // Borders and wicks are not random. They follow their body color.
  return {
    background,
    upBody,
    downBody,
    upBorder: locks.up ? currentTheme.upBorder : upBody,
    downBorder: locks.down ? currentTheme.downBorder : downBody,
    upWick: locks.up ? currentTheme.upWick : upBody,
    downWick: locks.down ? currentTheme.downWick : downBody,
  };
}
