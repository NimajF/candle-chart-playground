import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { parseHexColor } from '../theme/model';
import { CopyButton } from '../ui/CopyButton';

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
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
    <div className="flex items-center justify-between gap-3 text-sm">
      <span>{label}</span>
      <span className="flex items-center gap-2">
        <span className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            style={{ backgroundColor: value }}
            className="h-7 w-9 cursor-pointer rounded border border-zinc-800"
            aria-label={`Pick ${label} color`}
          />
          {open && (
            <>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="fixed inset-0 cursor-default"
                aria-label="Close color picker"
              />
              <div className="absolute right-0 z-10 mt-2 rounded-xl border border-zinc-700 bg-zinc-900 p-3 shadow-2xl shadow-black/60">
                <HexColorPicker
                  color={value}
                  onChange={(c) => onChange(parseHexColor(c) ?? value)}
                />
              </div>
            </>
          )}
        </span>
        <input
          type="text"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onBlur={() => setDraft(null)}
          spellCheck={false}
          maxLength={7}
          className={`w-20 rounded border bg-zinc-900 px-2 py-1 font-mono uppercase ${
            isValid ? 'border-zinc-700' : 'border-red-500'
          }`}
        />
        <CopyButton value={value} label={`Copy ${label} color`} />
      </span>
    </div>
  );
}
