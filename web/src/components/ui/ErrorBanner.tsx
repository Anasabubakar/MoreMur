"use client";

type Props = {
  title?: string;
  message: string;
  code?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
};

export function ErrorBanner({
  title = "Something went wrong",
  message,
  code,
  onRetry,
  onDismiss,
}: Props) {
  return (
    <div
      role="alert"
      className="mb-4 border-brutal border-danger bg-danger-surface p-3 shadow-brutal-sm"
    >
      <p className="font-mono text-xs font-bold uppercase text-danger">{title}</p>
      <p className="mt-1 font-[family-name:var(--font-body)] text-sm text-ink">{message}</p>
      {code && (
        <p className="mt-2 font-mono text-[10px] uppercase text-muted">Code: {code}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="border-brutal bg-accent px-3 py-1 font-mono text-xs font-bold uppercase text-accent-fg"
          >
            Try again
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="border-brutal bg-surface px-3 py-1 font-mono text-xs font-bold uppercase text-ink"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
