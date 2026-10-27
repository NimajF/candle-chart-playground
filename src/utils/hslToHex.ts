// h: 0-360, s and l: 0-100. Returns "#RRGGBB" uppercase, same format as parseHexColor.
export function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const light = l / 100;
  const a = sat * Math.min(light, 1 - light);

  function channel(n: number): string {
    const k = (n + h / 30) % 12;
    const value = light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(value * 255)
      .toString(16)
      .padStart(2, '0');
  }

  return `#${channel(0)}${channel(8)}${channel(4)}`.toUpperCase();
}
