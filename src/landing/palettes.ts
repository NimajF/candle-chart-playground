import { PRESET_THEMES } from '../theme/presets';

export interface CandlePalette {
  readonly name: string;
  readonly background: string;
  readonly up: string;
  readonly down: string;
}

function fromPreset(id: string): CandlePalette {
  const theme = PRESET_THEMES.find((t) => t.id === id)!;
  return {
    name: theme.name,
    background: theme.colors.background,
    up: theme.colors.upBody,
    down: theme.colors.downBody,
  };
}

// The palettes the page cycles through. "Sunset" is the theme saved in the demo video.
export const PALETTES: readonly CandlePalette[] = [
  fromPreset('lime'),
  fromPreset('neon'),
  { name: 'Sunset', background: '#14213D', up: '#FFB020', down: '#7C5CFF' },
  fromPreset('midnight'),
  fromPreset('forest'),
  fromPreset('paper'),
];
