'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { drawWinnerAction, type FormState } from '@/lib/actions/admin';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm('Draw a winner? A random valid (confirmed) entry will be selected.')) {
          e.preventDefault();
        }
      }}
      className="btn-primary px-4 py-2 text-sm"
    >
      {pending ? 'Drawing…' : '🎲 Draw winner'}
    </button>
  );
}

export function DrawWinnerButton({ competitionId }: { competitionId: string }) {
  const [state, action] = useFormState<FormState, FormData>(
    drawWinnerAction.bind(null, competitionId),
    {},
  );
  return (
    <form action={action} className="text-right">
      <Submit />
      {state.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
      {state.success && <p className="mt-1 text-xs text-emerald-600">{state.success}</p>}
    </form>
  );
}
