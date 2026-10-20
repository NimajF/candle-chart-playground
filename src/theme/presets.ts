import type { Theme } from './model';

export const PRESET_THEMES: readonly Theme[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      background: '#0B0E14',
      upBody: '#26A69A',
      downBody: '#EF5350',
      upBorder: '#26A69A',
      downBorder: '#EF5350',
      upWick: '#26A69A',
      downWick: '#EF5350',
    },
  },
  {
    id: 'paper',
    name: 'Paper',
    colors: {
      background: '#FFFFFF',
      upBody: '#089981',
      downBody: '#F23645',
      upBorder: '#089981',
      downBorder: '#F23645',
      upWick: '#089981',
      downWick: '#F23645',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      background: '#0F1A14',
      upBody: '#4ADE80',
      downBody: '#A16207',
      upBorder: '#22C55E',
      downBorder: '#854D0E',
      upWick: '#86EFAC',
      downWick: '#CA8A04',
    },
  },
  {
    id: 'ember',
    name: 'Ember',
    colors: {
      background: '#1A0F0A',
      upBody: '#FB923C',
      downBody: '#7F1D1D',
      upBorder: '#F97316',
      downBorder: '#DC2626',
      upWick: '#FDBA74',
      downWick: '#EF4444',
    },
  },
  {
    id: 'mono',
    name: 'Mono',
    colors: {
      background: '#111111',
      upBody: '#E5E5E5',
      downBody: '#111111',
      upBorder: '#E5E5E5',
      downBorder: '#737373',
      upWick: '#E5E5E5',
      downWick: '#737373',
    },
  },
  {
    id: 'neon',
    name: 'Neon',
    colors: {
      background: '#0A0A14',
      upBody: '#00FFA3',
      downBody: '#FF2E97',
      upBorder: '#00FFA3',
      downBorder: '#FF2E97',
      upWick: '#00FFA3',
      downWick: '#FF2E97',
    },
  },
];
