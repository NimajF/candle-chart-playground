export interface Candle {
  readonly time: string; // 'YYYY-MM-DD'
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
}
