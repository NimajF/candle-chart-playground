import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { parseHexColor } from '../theme/model';
import { CopyButton } from '../ui/CopyButton';

interface ColorFieldProps {
  label: string; // not shown, used for accessibility
  value: string;
  onChange: (value: string) => void;
  popoverAlign?: 'left' | 'right'; // which edge the picker popover sticks to
}

export function ColorField({ label, value, onChange, popoverAlign = 'left' }: ColorFieldProps) {
  const [draft, setDraft] = useState<string | null>(null); // null = not typing.
  const [open, setOpen] = useState(false);

  const text = draft ?? value; // if typing, show the draft, otherwise show the actual value.
  const isValid = parseHexColor(text) !== null;

  function handleTextChange(newText: string) {
    setDraft(newText);
    const parsed = parseHexColor(newText);
    if (parsed) onChange(parsed);
  }

  return (
    <div
      className={`group relative flex min-w-0 items-center gap-1 rounded-control border bg-field p-1 transition-colors duration-150 ease-soft focus-within:border-accent-line ${
        isValid ? 'border-line hover:border-line-strong' : 'border-danger'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ backgroundColor: value }}
        className="size-5 shrink-0 cursor-pointer rounded-[6px] border border-line-strong"
        aria-label={`Pick ${label} color`}
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
      <span className="opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100">
        <CopyButton value={value} label={`Copy ${label} color`} />
      </span>

      {open && (
        <>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
            aria-label="Close color picker"
          />
          <div
            className={`absolute top-full z-20 mt-2 rounded-card bg-surface-raised p-3 shadow-popover ${
              popoverAlign === 'left' ? 'left-0' : 'right-0'
            }`}
          >
            <HexColorPicker color={value} onChange={(c) => onChange(parseHexColor(c) ?? value)} />
          </div>
        </>
      )}
    </div>
  );
}
