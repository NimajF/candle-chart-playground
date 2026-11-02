import { useEffect, useRef } from 'react';
import { XIcon } from '@phosphor-icons/react';
import type { Theme } from '../theme/model';
import { ThemeList, ThemeListHeader } from './ThemeList';

interface ThemeListDialogProps {
  presets: readonly Theme[];
  saved: readonly Theme[];
  activeId: string;
  onSelect: (theme: Theme) => void;
  onDelete: (theme: Theme) => void;
  onClose: () => void;
}

export function ThemeListDialog({
  presets,
  saved,
  activeId,
  onSelect,
  onDelete,
  onClose,
}: ThemeListDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open as real modal
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="mx-auto mt-[10vh] max-h-[75vh] w-full max-w-xl flex-col overflow-hidden rounded-panel border border-line-strong bg-surface-raised text-fg shadow-popover backdrop:bg-black/60 backdrop:backdrop-blur-sm open:flex"
    >
      <header className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-semibold">
          Themes <span className="font-normal text-fg-faint">{presets.length + saved.length}</span>
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="cursor-pointer rounded-control p-1.5 text-fg-muted transition-colors duration-150 ease-soft hover:bg-hover hover:text-fg"
        >
          <XIcon size={16} />
        </button>
      </header>

      <div className="border-t border-line">
        <ThemeListHeader />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        <GroupLabel>Presets</GroupLabel>
        <ThemeList themes={presets} activeId={activeId} onSelect={onSelect} />

        <GroupLabel>Saved</GroupLabel>
        {saved.length === 0 ? (
          <p className="px-4 py-2 text-xs text-fg-faint">
            No saved themes yet. Edit a theme and press Save.
          </p>
        ) : (
          <ThemeList themes={saved} activeId={activeId} onSelect={onSelect} onDelete={onDelete} />
        )}
      </div>
    </dialog>
  );
}

function GroupLabel({ children }: { children: string }) {
  return <h3 className="px-4 pt-3 pb-1 text-xs font-semibold text-fg-muted">{children}</h3>;
}
