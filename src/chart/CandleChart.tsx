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
import { getAxisColors } from './axisColors';
import type { Candle } from './types';

interface CandleChartProps {
  colors: ThemeColors;
  candles: readonly Candle[];
}

export function CandleChart({ colors, candles }: CandleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  // Create the chart once. No grid lines. Axes, crosshair and last price are visible for realism.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      autoSize: true,
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      timeScale: { rightOffset: 5 },
      crosshair: { mode: CrosshairMode.Normal },
    });

    const series = chart.addSeries(CandlestickSeries);

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
    chartRef.current?.timeScale().setVisibleLogicalRange({
      from: candles.length - 100,
      to: candles.length,
    });
  }, [candles]);

  // Apply colors in place. Never recreate the chart on a color change.
  useEffect(() => {
    const axis = getAxisColors(colors.background);
    chartRef.current?.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: colors.background },
        textColor: axis.text,
      },
      rightPriceScale: { borderColor: axis.border },
      timeScale: { borderColor: axis.border },
      crosshair: {
        vertLine: { color: axis.crosshair, labelBackgroundColor: axis.crosshairLabel },
        horzLine: { color: axis.crosshair, labelBackgroundColor: axis.crosshairLabel },
      },
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
