'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createWinnerManualAction, type FormState } from '@/lib/actions/admin';
import { ImageField } from './image-field';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary px-5 py-2.5">
      {pending ? 'Saving…' : 'Add winner'}
    </button>
  );
}

export function ManualWinnerForm({
  competitions,
}: {
  competitions: { id: string; title: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useFormState<FormState, FormData>(createWinnerManualAction, {});

  if (competitions.length === 0) {
    return (
      <p className="text-sm text-ink/50">
        Every competition already has a winner. New winners can be added once more competitions exist.
      </p>
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-secondary px-4 py-2 text-sm">
        + Add winner manually
      </button>
    );
  }

  return (
    <form action={action} className="space-y-3 rounded-2xl border border-surface-variant bg-white p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Competition</label>
          <select name="competitionId" required className="input">
            <option value="">Select a competition…</option>
            {competitions.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Winner name</label>
          <input name="name" required className="input" />
        </div>
        <div>
          <label className="label">Location</label>
          <input name="location" className="input" />
        </div>
        <div>
          <label className="label">Winning ticket #</label>
          <input name="ticketNumber" type="number" min="1" className="input" />
        </div>
      </div>
      <div>
        <label className="label">Quote</label>
        <textarea name="quote" rows={2} className="input resize-y" />
      </div>
      <ImageField name="image" label="Winner photo" folder="winners" hint="Defaults to the prize image if left blank." />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" className="accent-brand-600" />
          Publish immediately
        </label>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setOpen(false)} className="btn-ghost px-3 py-2 text-sm">
            Cancel
          </button>
          <Submit />
        </div>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-600">{state.success}</p>}
    </form>
  );
}
