export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min; // Random num between min and max
}
