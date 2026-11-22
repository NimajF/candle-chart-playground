import { useEffect, useRef } from 'react';
import { COLOR_LABELS, type ColorKey, type ThemeColors } from '../theme/model';
import { CopyButton } from '../ui/CopyButton';
import { TRADINGVIEW_SECTIONS } from './tradingViewFields';
import { XIcon } from '@phosphor-icons/react';

interface TradingViewDialogProps {
  colors: ThemeColors;
  themeName: string;
  onClose: () => void;
}

export function TradingViewDialog({ colors, themeName, onClose }: TradingViewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const templateName = themeName.trim() || 'Untitled Theme';

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
          <h2 className="text-base font-semibold">Using your theme in TradingView</h2>
          <p className="text-sm text-fg-muted">
            TradingView can't import themes, so you copy each color by hand. Here's where each one
            goes.
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
        {TRADINGVIEW_SECTIONS.map((section) => (
          <section key={section.tab} className="space-y-2">
            <h3 className="text-sm font-semibold tracking-wide text-fg">{section.tab} tab</h3>
            <ul className="space-y-1.5">
              {section.fields.map((field) => (
                <li key={field.label} className="flex items-center justify-between gap-3">
                  <span>{field.label}</span>
                  <div className="flex gap-2">
                    {field.up && <ColorChip colorKey={field.up} colors={colors} />}
                    {field.down && <ColorChip colorKey={field.down} colors={colors} />}
                    {field.single && <ColorChip colorKey={field.single} colors={colors} />}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold tracking-wide text-fg">How to apply</h3>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>
              Open <strong className="text-fg">Chart settings</strong> (gear icon, or right-click
              the chart → Settings).
            </li>
            <li>
              In the <strong className="text-fg">Symbol</strong> tab, keep Body, Borders and Wick
              checked, then paste each color.
            </li>
            <li>
              In the <strong className="text-fg">Canvas</strong> tab, set Background to Solid and
              paste the background color.
            </li>
            <li>
              <span className="flex flex-wrap items-center gap-1.5">
                Click <strong className="text-fg">Template → Save as…</strong> and name it
                <span className="flex items-center gap-1 rounded-control border border-line bg-field py-0.5 pr-1 pl-2 font-semibold text-fg">
                  {templateName}
                  <CopyButton value={templateName} label="Copy template name" />
                </span>
              </span>
            </li>
          </ol>
        </section>
      </div>
      <div className="border-t border-line bg-field px-5 py-4 text-xs text-fg-faint">
        Not affiliated with or endorsed by TradingView. Menu names may vary between versions.
      </div>
    </dialog>
  );
}

interface ColorChipProps {
  colorKey: ColorKey;
  colors: ThemeColors;
}

// One color: swatch + hex + copy button.
function ColorChip({ colorKey, colors }: ColorChipProps) {
  const colorValue = colors[colorKey];

  return (
    <span className="flex items-center gap-1.5 rounded-control border border-line bg-field py-1 pr-1 pl-2">
      <span
        aria-hidden="true"
        style={{ backgroundColor: colorValue }}
        className="size-4 shrink-0 rounded-sm border border-line-strong"
      />
      <span className="font-data text-xs text-fg uppercase">{colorValue}</span>
      <CopyButton value={colorValue} label={`Copy ${COLOR_LABELS[colorKey]} color`} />
    </span>
  );
}
