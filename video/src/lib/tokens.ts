// Mirror of the app's dark tokens (src/styles/tokens.css), as plain values for inline styles.
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

export const T = {
  canvas: '#08080a',
  surface: '#151518',
  surfaceRaised: '#1f1f24',
  field: '#1e1e23',
  hover: '#2a2a30',
  line: '#29292f',
  lineStrong: '#3d3d45',
  fg: '#ededf0',
  fgMuted: '#a0a0a9',
  fgFaint: '#8a8a93',
  accent: '#c6f24e',
  accentFg: '#0b1003',
  accentSoft: 'rgba(198, 242, 78, 0.12)',
  accentLine: 'rgba(198, 242, 78, 0.45)',
  radiusControl: 8,
  radiusCard: 10,
  radiusPanel: 12,
} as const;

export const UI_FONT = loadInter('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin'],
}).fontFamily;

export const DATA_FONT = loadMono('normal', {
  weights: ['400', '500'],
  subsets: ['latin'],
}).fontFamily;
