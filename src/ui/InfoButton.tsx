import { InfoIcon } from '@phosphor-icons/react';

export function InfoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="About, privacy and credits"
      title="About, privacy and credits"
      className="cursor-pointer rounded-control border border-line bg-field p-2 text-fg-muted transition-colors duration-150 ease-soft hover:bg-hover hover:text-fg"
    >
      <InfoIcon size={16} />
    </button>
  );
}
