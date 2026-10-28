import { useEffect, useRef } from 'react';

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean; // red confirm button for destructive actions
  onConfirm: () => void;
}

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open as a real modal
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      // Esc key closes the dialog, but we want to handle it ourselves
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      className="m-auto w-full max-w-sm overflow-hidden rounded-panel border border-line-strong bg-surface-raised text-fg shadow-popover backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="space-y-2 p-5">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm text-fg-muted">{message}</p>
      </div>
      <div className="flex justify-end gap-2 border-t border-line bg-field px-5 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-control border border-line-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-fg transition-colors duration-150 ease-soft hover:bg-hover"
        >
          Cancel
        </button>
        {/* Both buttons have a 1px border so they end up the same size */}
        <button
          type="button"
          onClick={onConfirm}
          className={`cursor-pointer rounded-control border px-4 py-2 text-sm font-semibold transition-colors duration-150 ease-soft ${
            danger
              ? 'border-danger/40 bg-danger/15 text-danger hover:bg-danger/25'
              : 'border-transparent bg-accent text-accent-fg hover:bg-accent-hover'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
