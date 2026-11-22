import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { HeroBackdrop } from './HeroBackdrop';
import { CopyDemo, LockDemo, ShuffleDemo } from './PointDemos';
import { BrandLogo } from '../ui/BrandLogo';

// Where the playground lives (served from app.html).
const APP_PATH = '/app';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const POINTS: readonly { title: string; text: string; demo: ReactNode }[] = [
  {
    title: 'Shuffle',
    text: 'One click rolls a whole new palette: candles, wicks and background together. Keep rolling until it looks right.',
    demo: <ShuffleDemo />,
  },
  {
    title: 'Lock',
    text: 'Pin the background, the up candles or the down candles, then shuffle the rest. Keep what you love, change what you don’t.',
    demo: <LockDemo />,
  },
  {
    title: 'Copy',
    text: 'Every color is a hex code. Click it, copy it and paste it into your charting platform or your code.',
    demo: <CopyDemo />,
  },
];

function OpenButton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-5 text-sm',
    lg: 'h-13 px-7 text-base',
  };
  return (
    <a
      href={APP_PATH}
      className={`group inline-flex shrink-0 items-center whitespace-nowrap gap-2 rounded-control bg-accent font-semibold text-accent-fg shadow-accent transition-colors duration-150 ease-soft hover:bg-accent-hover focus-visible:ring-4 focus-visible:ring-accent-soft focus-visible:outline-none ${sizes[size]}`}
    >
      Open the playground
      <ArrowRightIcon
        size={size === 'lg' ? 18 : 16}
        weight="bold"
        className="transition-transform duration-200 ease-soft group-hover:translate-x-0.5"
      />
    </a>
  );
}

// Plays the demo only while it is on screen.
function DemoVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reduceMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <video
      ref={ref}
      className="block aspect-video w-full bg-canvas"
      poster="/landing/demo-poster.png"
      muted
      loop
      playsInline
      preload="metadata"
      controls={Boolean(reduceMotion)}
      aria-label="Demo of the playground: pick a theme, shuffle colors, lock the up and down candles, tune the sample data, save the theme and copy a hex code."
    >
      <source src="/landing/demo.mp4" type="video/mp4" />
    </video>
  );
}

export function Landing() {
  const reduceMotion = useReducedMotion();

  // The hero is the page's one authored entrance: headline, subline, action, then the demo rises.
  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28, filter: 'blur(10px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 0.9, delay, ease: EASE_OUT },
        };

  return (
    <div className="min-h-dvh overflow-x-clip bg-canvas text-fg">
      <header className="relative z-10 mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <a
          href="/"
          aria-label="Candle Theme Playground"
          className="flex items-center gap-2.5 rounded-control text-[15px] font-semibold focus-visible:ring-4 focus-visible:ring-accent-soft focus-visible:outline-none"
        >
          <BrandLogo size={28} />
          <span className="hidden sm:inline">Candle Theme Playground</span>
        </a>
        <OpenButton size="sm" />
      </header>

      <main>
        <section className="relative px-5 pt-10 pb-24 sm:px-8 sm:pt-14 sm:pb-32">
          <HeroBackdrop />

          <div className="relative mx-auto flex max-w-[1200px] flex-col items-center text-center">
            <motion.h1
              {...rise(0.05)}
              className="text-[clamp(2.75rem,7.2vw,5.5rem)] leading-[1.02] font-bold tracking-[-0.035em] text-balance"
            >
              Design candlestick themes <span className="text-accent">in seconds.</span>
            </motion.h1>

            <motion.p
              {...rise(0.2)}
              className="mt-6 max-w-[44ch] text-lg text-balance text-fg-muted sm:text-xl"
            >
              Shuffle palettes, lock the colors you love and copy the hex codes into your charting
              platform.
            </motion.p>

            <motion.div {...rise(0.35)} className="mt-9 flex flex-col items-center gap-3">
              <OpenButton size="lg" />
              <p className="text-sm text-fg-faint">Free · No sign-up · Runs in your browser</p>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 70, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.55, ease: EASE_OUT }}
              className="mt-12 w-full max-w-[1120px] overflow-hidden rounded-[14px] border border-line-strong shadow-[0_50px_120px_-30px_rgb(0_0_0/0.9)]"
            >
              <DemoVideo />
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 pb-28 sm:px-8 sm:pb-36">
          <h2 className="max-w-[18ch] text-3xl font-bold tracking-[-0.03em] text-balance sm:text-5xl">
            Land on a palette you love, fast.
          </h2>

          <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-0">
            {POINTS.map((point, i) => (
              <motion.article
                key={point.title}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -12% 0px' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE_OUT }}
                className="flex flex-col gap-6 md:px-8 md:first:pl-0 md:last:pr-0 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-line"
              >
                <div className="flex items-start md:min-h-[188px]">{point.demo}</div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold tracking-[-0.01em]">{point.title}</h3>
                  <p className="max-w-[34ch] text-[15px] leading-relaxed text-fg-muted">
                    {point.text}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="border-t border-line px-5 py-28 sm:px-8 sm:py-36">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -20% 0px' }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
            className="mx-auto flex max-w-[1200px] flex-col items-center gap-9 text-center"
          >
            <h2 className="max-w-[16ch] text-4xl font-bold tracking-[-0.035em] text-balance sm:text-6xl">
              Your next chart theme is one shuffle away.
            </h2>
            <div className="flex flex-col items-center gap-3">
              <OpenButton size="lg" />
              <p className="text-sm text-fg-faint">Free · No sign-up · Runs in your browser</p>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-line py-8">
        <div className="mx-auto flex max-w-[1200px] px-5 sm:px-8 flex-col gap-3 text-xs text-fg-faint sm:flex-row sm:items-start sm:justify-between">
          <span>© {new Date().getFullYear()} Benjamin Francisco - All rights reserved</span>
          <p className="max-w-[60ch] sm:text-right">
            Candles are synthetic sample data, not market data or financial advice. Charts powered
            by{' '}
            <a
              href="https://www.tradingview.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm font-semibold text-fg-muted underline decoration-accent-ink decoration-2 underline-offset-2 transition-colors duration-150 ease-soft hover:text-accent-ink focus-visible:ring-4 focus-visible:ring-accent-soft focus-visible:outline-none"
            >
              TradingView Lightweight Charts™
            </a>
            ; not affiliated with TradingView.
          </p>
        </div>
      </footer>
    </div>
  );
}
