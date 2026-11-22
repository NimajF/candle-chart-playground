import { useEffect, useRef } from 'react';
import { XIcon } from '@phosphor-icons/react';

interface InfoDialogProps {
  onClose: () => void;
}

const linkClass =
  'rounded-sm font-semibold text-fg underline decoration-accent-ink decoration-2 underline-offset-2 transition-colors duration-150 ease-soft hover:text-accent-ink focus-visible:ring-4 focus-visible:ring-accent-soft focus-visible:outline-none';

export function InfoDialog({ onClose }: InfoDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-panel border border-line-strong bg-surface-raised text-fg shadow-popover backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-4 border-b border-line p-5">
        <div className="space-y-1">
          <h2 className="text-base font-semibold">Candle Theme Playground</h2>
          <p className="text-sm text-fg-muted">
            Design color themes for candlestick charts and copy them into your project.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="cursor-pointer rounded-control p-1.5 text-fg-muted transition-colors duration-150 ease-soft hover:bg-hover hover:text-fg"
        >
          <XIcon size={16} />
        </button>
      </div>

      <div className="space-y-5 p-5 text-sm text-fg-muted">
        <section className="space-y-1.5">
          <h3 className="text-sm font-semibold tracking-wide text-fg">Disclaimer</h3>
          <p>
            The candles are randomly generated. They are synthetic data, not real market data, and
            nothing here is financial advice. The software is provided "as is", without warranty of
            any kind.
          </p>
        </section>

        <section className="space-y-1.5">
          <h3 className="text-sm font-semibold tracking-wide text-fg">Privacy</h3>
          <p>
            Your saved themes and light/dark preference are stored only in your browser
            (localStorage). They are never sent to any server. This site uses no cookies and no
            trackers. We use Vercel Web Analytics to count page views in aggregate, without cookies
            or personal data. Our hosting provider may keep standard technical logs, such as IP
            addresses.
          </p>
        </section>

        <section className="space-y-1.5">
          <h3 className="text-sm font-semibold tracking-wide text-fg">Credits</h3>
          <p>
            Charts powered by{' '}
            <a
              href="https://www.tradingview.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              TradingView Lightweight Charts™
            </a>
            . This project is not affiliated with or endorsed by TradingView.
          </p>
        </section>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line bg-field px-5 py-4 text-xs text-fg-faint">
        <span>© {new Date().getFullYear()} Benjamin Francisco - All rights reserved</span>
      </div>
    </dialog>
  );
}
