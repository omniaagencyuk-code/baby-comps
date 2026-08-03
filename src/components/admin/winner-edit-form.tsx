'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { FormState } from '@/lib/actions/admin';

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary px-4 py-2 text-sm">
      {pending ? 'Saving…' : 'Save'}
    </button>
  );
}

export function WinnerEditForm({
  action,
  values,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  values: { name: string; location: string; quote: string; image: string; published: boolean };
}) {
  const [state, formAction] = useFormState<FormState, FormData>(action, {});
  return (
    <form action={formAction} className="mt-3 space-y-3 border-t border-black/5 pt-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" defaultValue={values.name} placeholder="Winner name" className="input" />
        <input name="location" defaultValue={values.location} placeholder="Location" className="input" />
      </div>
      <input name="image" defaultValue={values.image} placeholder="Image URL" className="input" />
      <textarea name="quote" defaultValue={values.quote} placeholder="Winner quote" rows={2} className="input resize-y" />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={values.published} className="accent-brand-600" />
          Published on winners page
        </label>
        <SaveBtn />
      </div>
      {state.success && <p className="text-sm text-emerald-600">{state.success}</p>}
    </form>
  );
}
