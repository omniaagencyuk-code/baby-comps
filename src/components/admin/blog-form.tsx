'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import type { FormState } from '@/lib/actions/admin';
import { ImageField } from './image-field';

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary px-6 py-2.5">
      {pending ? 'Saving…' : 'Save post'}
    </button>
  );
}

export function BlogForm({
  action,
  values,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  values: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    author: string;
    published: boolean;
  };
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
          <label className="label" htmlFor="slug">Slug</label>
          <input id="slug" name="slug" defaultValue={values.slug} placeholder="auto from title" className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="excerpt">Excerpt</label>
        <input id="excerpt" name="excerpt" defaultValue={values.excerpt} className="input" />
      </div>
      <ImageField name="coverImage" label="Cover image" defaultValue={values.coverImage} folder="blog" />
      <div>
        <label className="label" htmlFor="content">Content *</label>
        <textarea id="content" name="content" defaultValue={values.content} rows={12} required className="input resize-y" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <label className="label" htmlFor="author">Author</label>
            <input id="author" name="author" defaultValue={values.author} className="input" />
          </div>
          <label className="flex items-center gap-2 self-end pb-3 text-sm">
            <input type="checkbox" name="published" defaultChecked={values.published} className="accent-brand-600" />
            Published
          </label>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SubmitBtn />
        <Link href="/admin/blog" className="btn-ghost px-4 py-2.5">Cancel</Link>
      </div>
    </form>
  );
}
