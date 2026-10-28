import { CornersInIcon, CornersOutIcon } from '@phosphor-icons/react';

type FullscreenToggleProps = {
  isFullscreen: boolean;
  onToggle: () => void;
};

export function FullscreenToggle({ isFullscreen, onToggle }: FullscreenToggleProps) {
  const label = isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className="cursor-pointer rounded-control border border-line bg-field p-2 text-fg-muted transition-colors duration-150 ease-soft hover:bg-hover hover:text-fg"
    >
      {isFullscreen ? <CornersInIcon size={16} /> : <CornersOutIcon size={16} />}
    </button>
  );
}
