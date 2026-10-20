export const COLOR_KEYS = [
  'background',
  'upBody',
  'downBody',
  'upBorder',
  'downBorder',
  'upWick',
  'downWick',
] as const;

export type ColorKey = (typeof COLOR_KEYS)[number];

export type ThemeColors = Readonly<Record<ColorKey, string>>;

export interface Theme {
  readonly id: string;
  readonly name: string;
  readonly colors: ThemeColors;
}

export const COLOR_LABELS: Record<ColorKey, string> = {
  background: 'Background',
  upBody: 'Up Body',
  downBody: 'Down Body',
  upBorder: 'Up Border',
  downBorder: 'Down Border',
  upWick: 'Up Wick',
  downWick: 'Down Wick',
};

const HEX_COLOR = /^#?([0-9a-f]{6})$/i; // Regular expression to match a valid hex color code.

// Accepts "26a69a" or "#26a69a" and returns "#26A69A". Returns null if the input is not a valid hex color code.
export function parseHexColor(input: string): string | null {
  const match = HEX_COLOR.exec(input.trim());
  return match ? `#${match[1].toUpperCase()}` : null;
}
