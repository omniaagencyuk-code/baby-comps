'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SaveButton({
  competitionId,
  initialSaved,
  isAuthenticated,
}: {
  competitionId: string;
  initialSaved: boolean;
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setLoading(true);
    // Optimistic update.
    setSaved((s) => !s);
    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitionId }),
      });
      const data = await res.json();
      if (res.ok) setSaved(data.saved);
      else setSaved((s) => !s); // revert on failure
    } catch {
      setSaved((s) => !s);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved' : 'Save competition'}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
        saved
          ? 'border-brand-300 bg-brand-50 text-brand-700'
          : 'border-black/10 bg-white text-ink/70 hover:border-brand-200 hover:text-brand-600'
      }`}
    >
      <span className={saved ? 'scale-110 transition' : 'transition'}>{saved ? '❤️' : '🤍'}</span>
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
