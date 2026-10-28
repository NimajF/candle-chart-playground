import { DiceFiveIcon } from '@phosphor-icons/react';

interface RandomizeButtonProps {
  label: string;
  onClick: () => void;
  isDisabled?: boolean;
}

export function RandomizeButton({ label, onClick, isDisabled }: RandomizeButtonProps) {
  return (
    // The title lives on the wrapper because some browsers don't show it on disabled buttons.
    <span title={label} className="inline-flex">
      <button
        type="button"
        onClick={onClick}
        disabled={isDisabled}
        aria-label={label}
        className="group flex items-center gap-1.5 rounded-control border border-line-strong bg-field px-3 py-1.5 text-xs font-semibold tracking-wide text-fg transition duration-150 ease-soft focus-visible:ring-4 focus-visible:ring-accent-soft focus-visible:outline-none enabled:cursor-pointer enabled:hover:border-accent-line enabled:hover:bg-hover enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <DiceFiveIcon
          size={18}
          weight="bold"
          className="-rotate-12 text-accent transition-transform duration-300 ease-soft group-enabled:group-hover:rotate-12 group-enabled:group-active:rotate-180 group-disabled:text-fg-faint"
        />
        Randomize
      </button>
    </span>
  );
}
