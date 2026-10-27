import { useState } from 'react';
import { CheckIcon, CopyIcon } from '@phosphor-icons/react';

interface CopyButtonProps {
  value: string;
  label: string;
}

export function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset the copied state after 1.5 seconds
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      title={label}
      className="cursor-pointer rounded-control p-1 text-fg-muted hover:bg-hover hover:text-fg"
    >
      {copied ? (
        <CheckIcon size={16} weight="bold" className="text-accent" />
      ) : (
        <CopyIcon size={16} />
      )}
    </button>
  );
}
