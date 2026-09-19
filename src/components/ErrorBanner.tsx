import { AlertCircle, X, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onDismiss, onRetry }: ErrorBannerProps) {
  return (
    <div
      id="weather-error-banner"
      role="alert"
      className="w-full max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-rose-950/70 border border-rose-800/80 text-rose-100 shadow-xl shadow-rose-950/30 flex items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2 rounded-xl bg-rose-900/60 border border-rose-700/50 text-rose-300 shrink-0 mt-0.5 sm:mt-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Weather Notice</h4>
          <p className="text-xs sm:text-sm text-rose-200/90 mt-0.5">{message}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <button
            id="error-retry-btn"
            type="button"
            onClick={onRetry}
            className="flex items-center gap-1 px-3 py-1.5 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded-xl text-xs font-semibold border border-rose-700/60 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        )}
        <button
          id="error-dismiss-btn"
          type="button"
          onClick={onDismiss}
          className="p-1.5 text-rose-300 hover:text-white rounded-lg hover:bg-rose-900/50 transition-colors"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
