import { QuestionIcon } from '@phosphor-icons/react';

// Small text link that opens the "How to use in TradingView" dialog.
export function TradingViewLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto flex cursor-pointer items-center gap-1.5 rounded-sm text-xs font-semibold text-fg-muted transition-colors duration-150 ease-soft hover:text-fg focus-visible:ring-4 focus-visible:ring-accent-soft focus-visible:outline-none"
    >
      <QuestionIcon size={14} />
      How to use in TradingView
    </button>
  );
}
