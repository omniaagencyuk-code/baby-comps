'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import type { FormState } from '@/lib/actions/admin';

interface Category {
  id: string;
  name: string;
}

interface CompetitionValues {
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  terms: string;
  heroImage: string;
  retailValue: number; // pounds
  ticketPrice: number; // pounds
  maxEntries: number;
  maxPerUser: string;
  drawDate: string; // yyyy-MM-ddThh:mm
  closingDate: string;
  skillQuestion: string;
  answerOptions: string; // newline separated
  correctAnswer: string;
  status: string;
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
  categoryId: string;
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary px-6 py-2.5">
      {pending ? 'Saving…' : 'Save competition'}
    </button>
  );
}

export function CompetitionForm({
  action,
  categories,
  values,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  categories: Category[];
  values: CompetitionValues;
}) {
  const [state, formAction] = useFormState<FormState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Prize details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="title">Prize title *</label>
            <input id="title" name="title" defaultValue={values.title} required className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="subtitle">Subtitle</label>
            <input id="subtitle" name="subtitle" defaultValue={values.subtitle} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="slug">Slug (URL)</label>
            <input id="slug" name="slug" defaultValue={values.slug} placeholder="auto from title" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="categoryId">Category</label>
            <select id="categoryId" name="categoryId" defaultValue={values.categoryId} className="input">
              <option value="">Uncategorised</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="heroImage">Hero image URL</label>
            <input id="heroImage" name="heroImage" defaultValue={values.heroImage} placeholder="https://…" className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="description">Description *</label>
            <textarea id="description" name="description" defaultValue={values.description} rows={5} required className="input resize-y" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Pricing &amp; entries</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label" htmlFor="retailValue">Retail value (£) *</label>
            <input id="retailValue" name="retailValue" type="number" step="0.01" min="0" defaultValue={values.retailValue} required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="ticketPrice">Ticket price (£) *</label>
            <input id="ticketPrice" name="ticketPrice" type="number" step="0.01" min="0" defaultValue={values.ticketPrice} required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="maxEntries">Max entries *</label>
            <input id="maxEntries" name="maxEntries" type="number" min="1" defaultValue={values.maxEntries} required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="maxPerUser">Max per user</label>
            <input id="maxPerUser" name="maxPerUser" type="number" min="1" defaultValue={values.maxPerUser} placeholder="unlimited" className="input" />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="closingDate">Closing date *</label>
            <input id="closingDate" name="closingDate" type="datetime-local" defaultValue={values.closingDate} required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="drawDate">Draw date *</label>
            <input id="drawDate" name="drawDate" type="datetime-local" defaultValue={values.drawDate} required className="input" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Skill question</h2>
        <div className="grid gap-4">
          <div>
            <label className="label" htmlFor="skillQuestion">Question</label>
            <input id="skillQuestion" name="skillQuestion" defaultValue={values.skillQuestion} className="input" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="answerOptions">Answer options (one per line)</label>
              <textarea id="answerOptions" name="answerOptions" defaultValue={values.answerOptions} rows={3} className="input resize-y" />
            </div>
            <div>
              <label className="label" htmlFor="correctAnswer">Correct answer</label>
              <input id="correctAnswer" name="correctAnswer" defaultValue={values.correctAnswer} className="input" />
              <p className="mt-1 text-xs text-ink/50">Must exactly match one of the options.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Terms, SEO &amp; publishing</h2>
        <div className="grid gap-4">
          <div>
            <label className="label" htmlFor="terms">Terms &amp; conditions</label>
            <textarea id="terms" name="terms" defaultValue={values.terms} rows={3} className="input resize-y" />
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={values.status} className="input">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="CLOSED">Closed</option>
                <option value="DRAWN">Drawn</option>
              </select>
            </div>
            <label className="flex items-center gap-2 self-end pb-3 text-sm">
              <input type="checkbox" name="featured" defaultChecked={values.featured} className="accent-brand-600" />
              Feature on homepage
            </label>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <SubmitBtn />
        <Link href="/admin/competitions" className="btn-ghost px-4 py-2.5">
          Cancel
        </Link>
      </div>
    </form>
  );
}
