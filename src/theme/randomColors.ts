import { randomBetween } from '../utils/random';
import { hslToHex } from '../utils/hslToHex';
import type { ThemeColors } from './model';

export function generateRandomCandlesColors(): ThemeColors {
  const isDarkBg = Math.random() < 0.5;

  // Almost-neutral background: any hue, low saturation, very dark or very light.
  const background = hslToHex(
    randomBetween(0, 360),
    randomBetween(10, 40),
    isDarkBg ? randomBetween(6, 14) : randomBetween(92, 97),
  );

  const bodyLightness = isDarkBg ? randomBetween(50, 65) : randomBetween(38, 50);

  // Down hue is 90-270 degrees away from up, so they are never too similar.
  const upHue = randomBetween(0, 360);
  const downHue = (upHue + randomBetween(90, 270)) % 360;

  const upBody = hslToHex(upHue, randomBetween(55, 85), bodyLightness);
  const downBody = hslToHex(downHue, randomBetween(55, 85), bodyLightness);

  // Borders and wicks are not random. They follow their body color.
  return {
    background,
    upBody,
    downBody,
    upBorder: upBody,
    downBorder: downBody,
    upWick: upBody,
    downWick: downBody,
  };
}
