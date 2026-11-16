import { Component, type ErrorInfo, type ReactNode } from 'react';
import { clearSavedThemes } from '../saved-themes/themeStorage';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndReload = () => {
    clearSavedThemes();
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="grid h-dvh place-items-center bg-canvas p-4 text-fg">
        <div className="w-full max-w-sm space-y-4 rounded-panel border border-line-strong bg-surface-raised p-5 shadow-popover">
          <div className="space-y-2">
            <h1 className="text-base font-semibold">Something went wrong</h1>
            <p className="text-sm text-fg-muted">
              The app hit an unexpected error. Reloading usually fixes it. If it keeps happening,
              your saved themes may be the cause: resetting them deletes them from this browser.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={this.handleResetAndReload}
              className="cursor-pointer rounded-control border border-line-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-fg transition-colors duration-150 ease-soft hover:bg-hover"
            >
              Reset saved themes
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="cursor-pointer rounded-control border border-transparent bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition-colors duration-150 ease-soft hover:bg-accent-hover"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
