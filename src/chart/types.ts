export interface Candle {
  readonly time: string; // 'YYYY-MM-DD'
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
}

export interface CandleParams {
  readonly count: number;
  readonly drift: number; // daily trend, 0.01 = +1% per day
  readonly volatility: number; // typical daily move, 0.02 = 2%
}
