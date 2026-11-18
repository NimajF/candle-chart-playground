// Storyboard for the app demo scene. Every time is a frame number (30 fps) relative to the start
// of the scene. Positions are in app pixels (the mocked app is laid out at 1440 × 774).
import type { Candle, CandleParams } from '../../../src/chart/types';
import type { Theme, ThemeColors } from '../../../src/theme/model';
import { DEFAULT_CANDLE_PARAMS, generateCandles } from '../../../src/chart/generateCandles';
import { PRESET_THEMES } from '../../../src/theme/presets';
import { lerpColors, palette } from './colors';
import { clamp01, easeOut, track } from './anim';
import { withSeed } from './seeded';

export const APP_DURATION = 700;

// ---------------------------------------------------------------------------------------------
// Layout: the browser window and how app pixels map onto the 1920 × 1080 stage.

export const APP_W = 1440;
export const APP_H = 774;
export const WINDOW = { x: 160, y: 120, w: 1600, chrome: 40 };
export const APP_SCALE = WINDOW.w / APP_W;

export function toStage([x, y]: readonly [number, number]): [number, number] {
  return [WINDOW.x + x * APP_SCALE, WINDOW.y + WINDOW.chrome + y * APP_SCALE];
}

// Slider geometry, shared by the mock and by the cursor so the drag lines up with the thumb.
export const TRACK_W = 96;
export const SLIDERS = {
  trend: { trackX: 204, min: -0.01, max: 0.01 },
  volatility: { trackX: 474, min: 0.002, max: 0.05 },
} as const;
export const TOOLBAR_Y = 84;

export function thumbX(slider: keyof typeof SLIDERS, value: number): number {
  const s = SLIDERS[slider];
  return s.trackX + ((value - s.min) / (s.max - s.min)) * TRACK_W;
}

const TARGETS = {
  start: [880, 420],
  neonRow: [1200, 222],
  randomizeColors: [1367, 444],
  lockUp: [1275, 532],
  lockDown: [1390, 532],
  trendFrom: [thumbX('trend', 0), TOOLBAR_Y],
  trendTo: [thumbX('trend', 0.006), TOOLBAR_Y],
  volFrom: [thumbX('volatility', 0.015), TOOLBAR_Y],
  volTo: [thumbX('volatility', 0.022), TOOLBAR_Y],
  apply: [1075, 84],
  randomizeCandles: [981, 84],
  nameInput: [1300, 369],
  save: [1354, 739],
  upBodyField: [1252, 565],
  copyUpBody: [1300, 565],
} as const satisfies Record<string, readonly [number, number]>;

// ---------------------------------------------------------------------------------------------
// Clicks

export const CLICK = {
  neon: 58,
  randomize: [105, 135, 165, 285, 315],
  lockUp: 228,
  lockDown: 254,
  apply: 463,
  randomizeCandles: 498,
  nameInput: 548,
  save: 598,
  copy: 645,
} as const;

export const DRAGS = [
  [378, 400],
  [422, 440],
] as const;

export const ALL_CLICKS = [
  CLICK.neon,
  ...CLICK.randomize,
  CLICK.lockUp,
  CLICK.lockDown,
  DRAGS[0][0],
  DRAGS[1][0],
  CLICK.apply,
  CLICK.randomizeCandles,
  CLICK.nameInput,
  CLICK.save,
  CLICK.copy,
];

// ---------------------------------------------------------------------------------------------
// Cursor path: [frame, target]. The cursor eases between consecutive points.

const CURSOR_PATH: readonly (readonly [number, keyof typeof TARGETS])[] = [
  [0, 'start'],
  [30, 'start'],
  [55, 'neonRow'],
  [75, 'neonRow'],
  [100, 'randomizeColors'],
  [200, 'randomizeColors'],
  [225, 'lockUp'],
  [232, 'lockUp'],
  [250, 'lockDown'],
  [258, 'lockDown'],
  [280, 'randomizeColors'],
  [345, 'randomizeColors'],
  [372, 'trendFrom'],
  [DRAGS[0][0], 'trendFrom'],
  [DRAGS[0][1], 'trendTo'],
  [405, 'trendTo'],
  [418, 'volFrom'],
  [DRAGS[1][0], 'volFrom'],
  [DRAGS[1][1], 'volTo'],
  [445, 'volTo'],
  [460, 'apply'],
  [470, 'apply'],
  [495, 'randomizeCandles'],
  [520, 'randomizeCandles'],
  [545, 'nameInput'],
  [578, 'nameInput'],
  [595, 'save'],
  [612, 'save'],
  [630, 'upBodyField'],
  [634, 'upBodyField'],
  [642, 'copyUpBody'],
];

export const CURSOR_VISIBLE = [20, 690] as const;

export function cursorAt(frame: number): [number, number] {
  const x = track(
    frame,
    CURSOR_PATH.map(([t, k]) => [t, TARGETS[k][0]] as const),
  );
  const y = track(
    frame,
    CURSOR_PATH.map(([t, k]) => [t, TARGETS[k][1]] as const),
  );
  return toStage([x, y]);
}

export function isDragging(frame: number): boolean {
  return DRAGS.some(([a, b]) => frame >= a && frame <= b);
}

// ---------------------------------------------------------------------------------------------
// Camera: [frame, focus point on the stage, zoom]. The focus point is kept at the frame center.

type Shot = { x: number; y: number; zoom: number };
const FULL: Shot = { x: 960, y: 540, zoom: 1 };
const COLORS: Shot = { x: 1300, y: 720, zoom: 1.6 };
const TOOLBAR: Shot = { x: 782, y: 430, zoom: 1.5 };
// Wide enough to keep the theme list (where the saved theme appears) below the caption and the
// Save button above the bottom edge.
const SIDEBAR: Shot = { x: 1100, y: 609, zoom: 1.3 };

const CAMERA: readonly (readonly [number, Shot])[] = [
  [0, FULL],
  [190, FULL],
  [222, COLORS],
  [345, COLORS],
  [377, TOOLBAR],
  [518, TOOLBAR],
  [550, SIDEBAR],
  [668, SIDEBAR],
  [698, FULL],
];

export function cameraAt(frame: number): Shot {
  const pick = (key: keyof Shot) =>
    track(
      frame,
      CAMERA.map(([t, s]) => [t, s[key]] as const),
    );
  return { x: pick('x'), y: pick('y'), zoom: pick('zoom') };
}

// ---------------------------------------------------------------------------------------------
// Captions

export interface CaptionCue {
  from: number;
  to: number;
  lead: string;
  accent: string;
}

export const CAPTIONS: readonly CaptionCue[] = [
  { from: 18, to: 84, lead: 'Start from a', accent: 'preset.' },
  { from: 90, to: 196, lead: 'Shuffle', accent: 'endless palettes.' },
  { from: 206, to: 344, lead: 'Lock what you love.', accent: 'Shuffle the rest.' },
  { from: 356, to: 514, lead: 'Shape the', accent: 'sample data.' },
  { from: 528, to: 612, lead: 'Name it.', accent: 'Save it.' },
  { from: 618, to: 698, lead: 'Copy any color', accent: 'straight into your code.' },
];

// ---------------------------------------------------------------------------------------------
// Colors. Hand-picked results of "Randomize" so every frame of the ad looks good.

const preset = (id: string): Theme => PRESET_THEMES.find((t) => t.id === id)!;

export const FINAL_COLORS = palette('#14213D', '#FFB020', '#7C5CFF');

const COLOR_EVENTS: readonly (readonly [number, ThemeColors])[] = [
  [-100, preset('lime').colors],
  [CLICK.neon, preset('neon').colors],
  [CLICK.randomize[0], palette('#0E1726', '#38BDF8', '#F472B6')],
  [CLICK.randomize[1], palette('#F6F1E7', '#0F766E', '#E11D48')],
  [CLICK.randomize[2], palette('#1C1230', '#FFB020', '#7C5CFF')],
  // Up and down are locked from here on: only the background changes.
  [CLICK.randomize[3], palette('#0B0B0F', '#FFB020', '#7C5CFF')],
  [CLICK.randomize[4], FINAL_COLORS],
];

const COLOR_FADE = 8;

/** `shown` is what is on screen (mid-fade); `target` is the value the editor holds. */
export function colorsAt(frame: number): { shown: ThemeColors; target: ThemeColors } {
  let i = 0;
  while (i + 1 < COLOR_EVENTS.length && COLOR_EVENTS[i + 1][0] <= frame) i++;
  const [start, target] = COLOR_EVENTS[i];
  const from = i > 0 ? COLOR_EVENTS[i - 1][1] : target;
  const p = easeOut(clamp01((frame - start) / COLOR_FADE));
  return { shown: lerpColors(from, target, p), target };
}

// ---------------------------------------------------------------------------------------------
// Candles: the real generator, seeded.

const APPLIED_PARAMS: CandleParams = { count: 120, drift: 0.006, volatility: 0.022 };
const RANDOM_PARAMS: CandleParams = { count: 120, drift: -0.003, volatility: 0.02 };

const CANDLE_EVENTS: readonly (readonly [number, readonly Candle[]])[] = [
  [6, withSeed(11, () => generateCandles(DEFAULT_CANDLE_PARAMS))],
  [CLICK.apply, withSeed(21, () => generateCandles(APPLIED_PARAMS))],
  [CLICK.randomizeCandles, withSeed(5, () => generateCandles(RANDOM_PARAMS))],
];

const REVEAL = 15; // the app's 500 ms reveal

export function candlesAt(frame: number): { candles: readonly Candle[]; reveal: number } {
  let i = 0;
  while (i + 1 < CANDLE_EVENTS.length && CANDLE_EVENTS[i + 1][0] <= frame) i++;
  const [start, candles] = CANDLE_EVENTS[i];
  return { candles, reveal: clamp01((frame - start) / REVEAL) };
}

export function paramsAt(frame: number): CandleParams {
  if (frame >= CLICK.randomizeCandles) return RANDOM_PARAMS;
  return {
    count: 120,
    drift: track(frame, [
      [DRAGS[0][0], DEFAULT_CANDLE_PARAMS.drift],
      [DRAGS[0][1], APPLIED_PARAMS.drift],
    ]),
    volatility: track(frame, [
      [DRAGS[1][0], DEFAULT_CANDLE_PARAMS.volatility],
      [DRAGS[1][1], APPLIED_PARAMS.volatility],
    ]),
  };
}

// ---------------------------------------------------------------------------------------------
// Editor state

export const SAVED_THEME: Theme = { id: 'sunset', name: 'Sunset', colors: FINAL_COLORS };

const TYPED_NAME = 'Sunset';
const TYPE_START = 554;
const FRAMES_PER_CHAR = 3;

export function nameAt(frame: number): { text: string; selected: boolean; focused: boolean } {
  const focused = frame >= CLICK.nameInput && frame < CLICK.save;
  if (frame < CLICK.neon) return { text: 'Lime Copy', selected: false, focused };
  if (frame < CLICK.nameInput + 2) return { text: 'Neon Copy', selected: false, focused };
  if (frame < TYPE_START) return { text: 'Neon Copy', selected: true, focused };
  const chars = Math.min(TYPED_NAME.length, Math.floor((frame - TYPE_START) / FRAMES_PER_CHAR) + 1);
  return { text: TYPED_NAME.slice(0, chars), selected: false, focused };
}

export function activeThemeAt(frame: number): string {
  if (frame >= CLICK.save) return SAVED_THEME.id;
  return frame >= CLICK.neon ? 'neon' : 'lime';
}

export function isDirtyAt(frame: number): boolean {
  return frame >= CLICK.randomize[0] && frame < CLICK.save;
}
