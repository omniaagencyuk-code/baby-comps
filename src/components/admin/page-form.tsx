'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import type { FormState } from '@/lib/actions/admin';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary px-6 py-2.5">
      {pending ? 'Saving…' : 'Save page'}
    </button>
  );
}

export function PageForm({
  action,
  values,
  lockSlug = false,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  values: {
    title: string;
    slug: string;
    content: string;
    metaTitle: string;
    metaDescription: string;
    published: boolean;
  };
  lockSlug?: boolean;
}) {
  const [state, formAction] = useFormState<FormState, FormData>(action, {});
  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      {state.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="title">Title *</label>
          <input id="title" name="title" defaultValue={values.title} required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="slug">Slug (URL)</label>
          <input
            id="slug"
            name="slug"
            defaultValue={values.slug}
            readOnly={lockSlug}
            className={`input ${lockSlug ? 'bg-slate-50 text-ink/50' : ''}`}
          />
          {lockSlug && <p className="mt-1 text-xs text-ink/50">Core page — slug is fixed.</p>}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="content">Content (Markdown: ## heading, - list, **bold**) *</label>
        <textarea id="content" name="content" defaultValue={values.content} rows={16} required className="input resize-y font-mono text-sm" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="metaTitle">Meta title</label>
          <input id="metaTitle" name="metaTitle" defaultValue={values.metaTitle} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="metaDescription">Meta description</label>
          <input id="metaDescription" name="metaDescription" defaultValue={values.metaDescription} className="input" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={values.published} className="accent-brand-600" />
        Published
      </label>
      <div className="flex items-center gap-3">
        <Submit />
        <Link href="/admin/pages" className="btn-ghost px-4 py-2.5">Cancel</Link>
      </div>
    </form>
  );
}
