import { DiceFiveIcon } from '@phosphor-icons/react';

interface RandomizeButtonProps {
  label: string;
  onClick: () => void;
}

export function RandomizeButton({ label, onClick }: RandomizeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="group flex cursor-pointer items-center gap-1.5 rounded-control border border-line-strong bg-field px-3 py-1.5 text-xs font-semibold tracking-wide text-fg transition duration-150 ease-soft hover:border-accent-line hover:bg-hover focus-visible:ring-4 focus-visible:ring-accent-soft focus-visible:outline-none active:scale-95"
    >
      <DiceFiveIcon
        size={18}
        weight="bold"
        className="-rotate-12 text-accent transition-transform duration-300 ease-soft group-hover:rotate-12 group-active:rotate-180"
      />
      Randomize
    </button>
  );
}
