// Chart chrome (axis text, borders, crosshair) is not themeable: it is derived from the background.
export interface AxisColors {
  text: string;
  border: string;
  crosshair: string;
  crosshairLabel: string;
}

// Perceived brightness of a #RRGGBB color, from 0 (black) to 255 (white).
function brightness(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

export function getAxisColors(background: string): AxisColors {
  const isLight = brightness(background) > 128;

  return isLight
    ? {
        text: '#4B5563',
        border: 'rgba(0, 0, 0, 0.15)',
        crosshair: 'rgba(0, 0, 0, 0.35)',
        crosshairLabel: '#374151',
      }
    : {
        text: '#9CA3AF',
        border: 'rgba(255, 255, 255, 0.15)',
        crosshair: 'rgba(255, 255, 255, 0.35)',
        crosshairLabel: '#4B5563',
      };
}
