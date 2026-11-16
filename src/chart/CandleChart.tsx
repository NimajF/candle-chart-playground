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
import { countChangedColors, lerpColors, prefersReducedMotion, runAnimation } from './animation';
import type { Candle } from './types';

interface CandleChartProps {
  colors: ThemeColors;
  candles: readonly Candle[];
}

const RIGHT_OFFSET = 5; // empty bars after the last candle
const MAX_VISIBLE = 100; // dont squeeze huge series
const REVEAL_MS = 500; // candles drawing in left to right
const COLOR_FADE_MS = 200;

export function CandleChart({ colors, candles }: CandleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const shownColorsRef = useRef<ThemeColors | null>(null); // colors currently on screen

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
  // The candles spawn left to right. The price range is pinned while revealing so axis doesnt jump.
  useEffect(() => {
    const chart = chartRef.current;
    const series = seriesRef.current;
    if (!chart || !series) return;

    const total = candles.length;
    const visible = Math.min(total, MAX_VISIBLE);
    const setRange = () =>
      chart.timeScale().setVisibleLogicalRange({
        from: total - visible,
        to: total - 1 + RIGHT_OFFSET,
      });

    chart.priceScale('right').applyOptions({ autoScale: true });

    if (total < 2 || prefersReducedMotion()) {
      series.setData([...candles]);
      setRange();
      return;
    }

    const shown = candles.slice(total - visible);
    const minValue = Math.min(...shown.map((c) => c.low));
    const maxValue = Math.max(...shown.map((c) => c.high));
    series.applyOptions({ autoscaleInfoProvider: () => ({ priceRange: { minValue, maxValue } }) });

    // Not-yet-revealed candles are kept as empty (whitespace) points, so the number of bars never
    // changes during the animation and the time scale stays put instead of scrolling.
    const firstVisible = total - visible;
    const dataUpTo = (revealed: number) =>
      candles.map((c, i) => (i < firstVisible + revealed ? c : { time: c.time }));

    series.setData(dataUpTo(0));
    setRange();

    const cancel = runAnimation(REVEAL_MS, (progress) => {
      series.setData(dataUpTo(Math.ceil(progress * visible)));
      // setData can affect the time scale, so re-pin the view every frame. The last frame then
      // matches the final chart exactly and there is no jump when the animation ends.
      setRange();
      if (progress === 1) series.applyOptions({ autoscaleInfoProvider: undefined });
    });

    return () => {
      cancel();
      series.applyOptions({ autoscaleInfoProvider: undefined });
    };
  }, [candles]);

  // Apply colors in place. Never recreate the chart on a color change.
  // Changes to several colors at once (randomize, switching themes) fade in. A single color change
  // (dragging the picker) is applied instantly so it stays responsive.
  useEffect(() => {
    const applyColors = (c: ThemeColors) => {
      const axis = getAxisColors(c.background);
      chartRef.current?.applyOptions({
        layout: {
          background: { type: ColorType.Solid, color: c.background },
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
        upColor: c.upBody,
        downColor: c.downBody,
        borderUpColor: c.upBorder,
        borderDownColor: c.downBorder,
        wickUpColor: c.upWick,
        wickDownColor: c.downWick,
      });
      shownColorsRef.current = c;
    };

    const from = shownColorsRef.current;
    if (!from || prefersReducedMotion() || countChangedColors(from, colors) < 2) {
      applyColors(colors);
      return;
    }

    // If an earlier fade was interrupted, `from` is the color that was on screen at that moment.
    return runAnimation(COLOR_FADE_MS, (progress) =>
      applyColors(progress === 1 ? colors : lerpColors(from, colors, progress)),
    );
  }, [colors]);

  return <div ref={containerRef} className="h-full w-full" />;
}
