'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this is where you'd forward to Sentry/LogRocket etc.
    console.error(error);
  }, [error]);

  return (
    <div className="container flex flex-col items-center justify-center py-24 text-center">
      <div className="text-5xl">🧸</div>
      <h1 className="mt-4 text-2xl font-bold text-secondaryink">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted">
        Sorry — an unexpected error occurred. Please try again. If it keeps happening, get in touch
        and we&apos;ll help.
      </p>
      <div className="mt-6 flex gap-3">
        <button onClick={reset} className="btn-primary px-5 py-2.5">
          Try again
        </button>
        <a href="/" className="btn-secondary px-5 py-2.5">
          Back home
        </a>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-muted/70">Reference: {error.digest}</p>
      )}
    </div>
  );
}
