import { useState } from 'react';
import { parseHexColor } from '../theme/model';

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const [draft, setDraft] = useState<string | null>(null); // null = not typing.

  const text = draft ?? value; // if typing, show the draft, otherwise show the actual value.
  const isValid = parseHexColor(text) !== null;

  function handleTextChange(newText: string) {
    setDraft(newText);
    const parsed = parseHexColor(newText);
    if (parsed) onChange(parsed);
  }

  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span>{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(parseHexColor(e.target.value) ?? value)}
          className="h-7 w-9 cursor-pointer rounded border border-zinc-700 bg-transparent"
        />
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
      </span>
    </label>
  );
}
