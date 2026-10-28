import { LockSimpleIcon, LockSimpleOpenIcon } from '@phosphor-icons/react';

interface LockToggleProps {
  locked: boolean;
  label: string;
  onToggle: () => void;
}

export function LockToggle({ locked, label, onToggle }: LockToggleProps) {
  const text = locked ? `Unlock ${label}` : `Lock ${label}`;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={locked}
      aria-label={text}
      title={text}
      className={`cursor-pointer rounded-control p-1 transition-colors duration-150 ease-soft hover:bg-hover ${
        locked ? 'text-accent' : 'text-fg-faint hover:text-fg'
      }`}
    >
      {locked ? <LockSimpleIcon size={16} weight="fill" /> : <LockSimpleOpenIcon size={16} />}
    </button>
  );
}
