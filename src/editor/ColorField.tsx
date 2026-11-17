import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HexColorPicker } from 'react-colorful';
import { parseHexColor } from '../theme/model';
import { CopyButton } from '../ui/CopyButton';

interface ColorFieldProps {
  label: string; // not shown, used for accessibility
  value: string;
  onChange: (value: string) => void;
  popoverAlign?: 'left' | 'right'; // which edge the picker popover sticks to
}

const POPOVER_GAP = 8; // px between the field and the popover
const VIEWPORT_MARGIN = 8; // keep the popover this far from the viewport edges

export function ColorField({ label, value, onChange, popoverAlign = 'left' }: ColorFieldProps) {
  const [draft, setDraft] = useState<string | null>(null); // null = not typing.
  const [open, setOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const text = draft ?? value; // if typing, show the draft, otherwise show the actual value.
  const isValid = parseHexColor(text) !== null;

  function handleTextChange(newText: string) {
    setDraft(newText);
    const parsed = parseHexColor(newText);
    if (parsed) onChange(parsed);
  }

  // The popover is portaled to <body> with fixed positioning so it floats above the layout
  // instead of growing the scrollable sidebar (which made a scrollbar appear and shift everything).
  // Positions are written straight to the DOM (no state) so placement never triggers re-renders.
  useLayoutEffect(() => {
    if (!open) return;

    function place() {
      const field = fieldRef.current;
      const popover = popoverRef.current;
      if (!field || !popover) return;
      const anchor = field.getBoundingClientRect();
      const { width, height } = popover.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Prefer below; flip above if it doesn't fit and there's more room up there.
      let top = anchor.bottom + POPOVER_GAP;
      if (top + height > vh - VIEWPORT_MARGIN && anchor.top - POPOVER_GAP - height >= VIEWPORT_MARGIN) {
        top = anchor.top - POPOVER_GAP - height;
      }
      top = Math.max(VIEWPORT_MARGIN, Math.min(top, vh - height - VIEWPORT_MARGIN));

      let left = popoverAlign === 'left' ? anchor.left : anchor.right - width;
      left = Math.max(VIEWPORT_MARGIN, Math.min(left, vw - width - VIEWPORT_MARGIN));

      popover.style.top = `${top}px`;
      popover.style.left = `${left}px`;
      popover.style.visibility = 'visible';
    }

    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true); // capture: also catches the sidebar's own scroll
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, popoverAlign]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div
      ref={fieldRef}
      className={`group relative flex min-w-0 items-center gap-1 rounded-control border bg-field p-1 transition-colors duration-150 ease-soft focus-within:border-accent-line ${
        isValid ? 'border-line hover:border-line-strong' : 'border-danger'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ backgroundColor: value }}
        className="size-5 shrink-0 cursor-pointer rounded-md border border-line-strong"
        aria-label={`Pick ${label} color`}
        aria-expanded={open}
      />
      <input
        type="text"
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        onBlur={() => setDraft(null)}
        spellCheck={false}
        maxLength={7}
        aria-label={`${label} hex value`}
        className="w-[7ch] min-w-0 flex-1 bg-transparent font-data text-xs text-fg uppercase outline-none"
      />
      <span className="absolute inset-y-1 right-1 flex items-center bg-field opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100">
        <CopyButton value={value} label={`Copy ${label} color`} />
      </span>

      {open &&
        createPortal(
          <>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
              aria-label="Close color picker"
            />
            <div
              ref={popoverRef}
              style={{ top: 0, left: 0, visibility: 'hidden' }} // placed by the layout effect
              className="fixed z-50 rounded-card bg-surface-raised p-3 shadow-popover"
            >
              <HexColorPicker color={value} onChange={(c) => onChange(parseHexColor(c) ?? value)} />
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
