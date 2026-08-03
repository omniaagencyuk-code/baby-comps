'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createCategoryAction, updateCategoryAction } from '@/lib/actions/categories';
import type { FormState } from '@/lib/actions/admin';

function Btn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary px-4 py-2 text-sm">
      {pending ? 'Saving…' : label}
    </button>
  );
}

export function CategoryCreateForm() {
  const [state, action] = useFormState<FormState, FormData>(createCategoryAction, {});
  return (
    <form action={action} className="flex flex-wrap items-end gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div>
        <label className="label">Name</label>
        <input name="name" required placeholder="e.g. Prams & Travel" className="input w-48" />
      </div>
      <div>
        <label className="label">Slug (optional)</label>
        <input name="slug" placeholder="auto" className="input w-40" />
      </div>
      <div className="min-w-[200px] flex-1">
        <label className="label">Description</label>
        <input name="description" className="input" />
      </div>
      <Btn label="Add category" />
      {state.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="w-full text-sm text-emerald-600">{state.success}</p>}
    </form>
  );
}

export function CategoryEditForm({
  id,
  values,
}: {
  id: string;
  values: { name: string; slug: string; description: string };
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useFormState<FormState, FormData>(
    updateCategoryAction.bind(null, id),
    {},
  );

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm font-medium text-brand-600 hover:underline">
        Edit
      </button>
    );
  }

  return (
    <form action={action} className="mt-3 flex flex-wrap items-end gap-2 rounded-xl bg-slate-50 p-3">
      <input name="name" defaultValue={values.name} required className="input w-40" />
      <input name="slug" defaultValue={values.slug} className="input w-32" />
      <input name="description" defaultValue={values.description} placeholder="Description" className="input flex-1" />
      <Btn label="Save" />
      <button type="button" onClick={() => setOpen(false)} className="btn-ghost px-3 py-2 text-sm">
        Close
      </button>
      {state.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
