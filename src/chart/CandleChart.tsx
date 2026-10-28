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

const RIGHT_OFFSET = 5; // empty bars after the last candle
const MAX_VISIBLE = 100; // dont squeeze huge series

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
      timeScale: { rightOffset: RIGHT_OFFSET },
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

  // Load new candles and reset the view: auto-fit prices, show the last MAX_VISIBLE bars plus RIGHT_OFFSET empty space.
  useEffect(() => {
    const chart = chartRef.current;
    seriesRef.current?.setData([...candles]);
    chart?.priceScale('right').applyOptions({ autoScale: true });

    const visible = Math.min(candles.length, MAX_VISIBLE);
    chart?.timeScale().setVisibleLogicalRange({
      from: candles.length - visible,
      to: candles.length - 1 + RIGHT_OFFSET,
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
