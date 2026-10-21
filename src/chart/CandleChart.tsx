import { useEffect, useRef } from 'react';
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  createChart,
  type IChartApi,
  type ISeriesApi,
} from 'lightweight-charts';
import type { ThemeColors } from '../theme/model';
import type { Candle } from './types';

interface CandleChartProps {
  colors: ThemeColors;
  candles: readonly Candle[];
}

export function CandleChart({ colors, candles }: CandleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  // Create the chart once. Candles only: no grid, axes or crosshair. Zoom and pan stay enabled.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      autoSize: true,
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      rightPriceScale: { visible: false },
      timeScale: { visible: false },
      crosshair: { mode: CrosshairMode.Hidden },
    });

    const series = chart.addSeries(CandlestickSeries, {
      priceLineVisible: false,
      lastValueVisible: false,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Update the series data whenever the candles prop changes. Fit the time scale to the new data.
  useEffect(() => {
    seriesRef.current?.setData([...candles]);
    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  // Apply colors in place. Never recreate the chart on a color change.
  useEffect(() => {
    chartRef.current?.applyOptions({
      layout: { background: { type: ColorType.Solid, color: colors.background } },
    });
    seriesRef.current?.applyOptions({
      upColor: colors.upBody,
      downColor: colors.downBody,
      borderUpColor: colors.upBorder,
      borderDownColor: colors.downBorder,
      wickUpColor: colors.upWick,
      wickDownColor: colors.downWick,
    });
  }, [colors]);

  return <div ref={containerRef} className="h-full w-full" />;
}
