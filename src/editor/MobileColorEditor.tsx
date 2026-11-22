import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { HexColorPicker } from 'react-colorful';
import { LockSimpleIcon, LockSimpleOpenIcon } from '@phosphor-icons/react';
import { COLOR_LABELS, parseHexColor, type ColorKey, type ThemeColors } from '../theme/model';
import type { ColorLocks } from '../theme/randomColors';
import { RandomizeButton } from '../ui/RandomizeButton';

interface MobileColorEditorProps {
  colors: ThemeColors;
  onChange: (key: ColorKey, color: string) => void;
  onRandomize: (locks: ColorLocks) => void;
}

// Rows are the lock groups (up / down), columns are the candle parts.
const PARTS = ['Body', 'Border', 'Wick'] as const;
const CANDLE_ROWS: { group: 'up' | 'down'; label: string; keys: ColorKey[] }[] = [
  { group: 'up', label: 'Up', keys: ['upBody', 'upBorder', 'upWick'] },
  { group: 'down', label: 'Down', keys: ['downBody', 'downBorder', 'downWick'] },
];

// Mobile version of ColorEditor: big color swatches instead of hex fields.
// Tapping a swatch opens a bottom sheet with the picker, so the chart stays visible above it.
export function MobileColorEditor({ colors, onChange, onRandomize }: MobileColorEditorProps) {
  const [locks, setLocks] = useState<ColorLocks>({ background: false, up: false, down: false });
  const [editingKey, setEditingKey] = useState<ColorKey | null>(null); // null = sheet closed

  function toggleLock(key: keyof ColorLocks) {
    setLocks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const allLocked = locks.background && locks.up && locks.down;

  return (
    // Fixed-width swatch columns keep the swatches close to their labels instead of spreading out.
    <section className="grid grid-cols-[auto_repeat(3,3.5rem)] items-center gap-x-3 gap-y-2">
      <span />
      {PARTS.map((part) => (
        <span key={part} className="text-center text-xs text-fg-faint">
          {part}
        </span>
      ))}

      {CANDLE_ROWS.map((row) => (
        <div key={row.group} className="contents">
          <LockRowLabel
            label={row.label}
            locked={locks[row.group]}
            onToggle={() => toggleLock(row.group)}
          />
          {row.keys.map((key) => (
            <Swatch key={key} label={COLOR_LABELS[key]} color={colors[key]} onClick={() => setEditingKey(key)} />
          ))}
        </div>
      ))}

      <LockRowLabel
        label="Background"
        locked={locks.background}
        onToggle={() => toggleLock('background')}
      />
      <Swatch
        label={COLOR_LABELS.background}
        color={colors.background}
        onClick={() => setEditingKey('background')}
      />
      {/* Randomize uses the free space at the end of the last row, so it needs no row of its own */}
      <div className="col-span-2 justify-self-end">
        <RandomizeButton
          label={allLocked ? 'Unlock a row to randomize' : 'Randomize unlocked colors'}
          onClick={() => onRandomize(locks)}
          isDisabled={allLocked}
        />
      </div>

      {editingKey && (
        <ColorSheet
          label={COLOR_LABELS[editingKey]}
          color={colors[editingKey]}
          onChange={(color) => onChange(editingKey, color)}
          onClose={() => setEditingKey(null)}
        />
      )}
    </section>
  );
}

// The whole label is the lock button: a big touch target instead of a tiny icon.
function LockRowLabel({ label, locked, onToggle }: { label: string; locked: boolean; onToggle: () => void }) {
  const text = locked ? `Unlock ${label.toLowerCase()} colors` : `Lock ${label.toLowerCase()} colors`;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={locked}
      aria-label={text}
      className={`flex h-9 cursor-pointer items-center gap-1.5 pr-2 text-sm transition-colors duration-150 ease-soft ${
        locked ? 'text-accent-ink' : 'text-fg-muted'
      }`}
    >
      {locked ? <LockSimpleIcon size={16} weight="fill" /> : <LockSimpleOpenIcon size={16} />}
      {label}
    </button>
  );
}

// The button is bigger than what you see: a small swatch, but a comfortable touch area around it.
function Swatch({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Edit ${label} color (${color})`}
      className="group flex h-9 w-full cursor-pointer items-center justify-center"
    >
      <span
        style={{ backgroundColor: color }}
        className="h-7 w-full rounded-md border border-line-strong transition-transform duration-150 ease-soft group-active:scale-90"
      />
    </button>
  );
}

interface ColorSheetProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

// Bottom sheet with the picker and the hex value. Covers the panel, not the chart.
function ColorSheet({ label, color, onChange, onClose }: ColorSheetProps) {
  const [draft, setDraft] = useState<string | null>(null); // null = not typing
  const text = draft ?? color;
  const isValid = parseHexColor(text) !== null;

  function handleTextChange(newText: string) {
    setDraft(newText);
    const parsed = parseHexColor(newText);
    if (parsed) onChange(parsed);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <>
      {/* Transparent backdrop: tap anywhere outside to close, the chart stays fully visible */}
      <button
        type="button"
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default"
        aria-label="Close color picker"
      />
      <div
        role="dialog"
        aria-label={`${label} color`}
        className="fixed inset-x-0 bottom-0 z-50 space-y-3 rounded-t-panel bg-surface-raised px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-popover"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-fg">{label}</span>
          <button
            type="button"
            onClick={onClose}
            className="h-10 cursor-pointer rounded-control px-3 text-sm font-semibold text-accent-ink"
          >
            Done
          </button>
        </div>

        <HexColorPicker
          color={color}
          onChange={(c) => onChange(parseHexColor(c) ?? color)}
          style={{ width: '100%', height: 160 }}
        />

        <label
          className={`flex h-11 items-center gap-3 rounded-control border bg-field px-3 ${
            isValid ? 'border-line-strong focus-within:border-accent-line' : 'border-danger'
          }`}
        >
          <span className="size-6 shrink-0 rounded-md border border-line-strong" style={{ backgroundColor: color }} />
          <input
            type="text"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={() => setDraft(null)}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off" // iOS would otherwise "fix" hex codes
            autoCapitalize="characters"
            maxLength={7}
            aria-label={`${label} hex value`}
            // 16px: smaller text makes iOS zoom in when the field gets focus
            className="min-w-0 flex-1 bg-transparent font-data text-base text-fg uppercase outline-none"
          />
        </label>
      </div>
    </>,
    document.body,
  );
}
