import type { Candle, CandleParams } from './types';

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min; // Random num between min and max
}

function round2(value: number): number {
  return Math.round(value * 100) / 100; // Round to 2 decimal places
}

function nextBusinessDay(date: string): string {
  const next = new Date(`${date}T00:00:00Z`);
  do {
    next.setUTCDate(next.getUTCDate() + 1);
  } while (next.getUTCDay() === 0 || next.getUTCDay() === 6); // Skip weekends (0 = Sunday, 6 = Saturday)
  return next.toISOString().slice(0, 10); // Return in YYYY-MM-DD format
}

export function generateCandles({ count, drift, volatility }: CandleParams): Candle[] {
  const candles: Candle[] = [];
  let price = 100;
  let time = '2026-01-02'; // Start on a weekday, so we can skip weekends easily.

  // loop
  for (let i = 0; i < count; i++) {
    const open = price;
    const close = round2(open * (1 + drift + randomBetween(-volatility, volatility)));
    const high = round2(Math.max(open, close) * (1 + randomBetween(0, volatility / 2)));
    const low = round2(Math.min(open, close) * (1 - randomBetween(0, volatility / 2)));

    candles.push({ time, open, high, low, close });

    price = close;
    time = nextBusinessDay(time);
  }

  return candles;
}

export function generateRandomCandlesParams(): CandleParams {
  return {
    count: 60,
    drift: randomBetween(-0.008, 0.008),
    volatility: randomBetween(0.008, 0.03),
  };
}

export const DEFAULT_CANDLE_PARAMS: CandleParams = {
  count: 60,
  drift: 0,
  volatility: 0.015,
};
// Candles start with SAMPLE_CANDLES
