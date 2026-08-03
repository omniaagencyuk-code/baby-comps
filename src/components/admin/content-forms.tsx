'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateHeroAction, createReviewAction, type FormState } from '@/lib/actions/admin';
import { ImageField } from './image-field';
import type { HeroContent, IconItem } from '@/lib/content';

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary px-5 py-2.5">
      {pending ? 'Saving…' : label}
    </button>
  );
}

export function HeroForm({ hero }: { hero: HeroContent }) {
  const [state, action] = useFormState<FormState, FormData>(updateHeroAction, {});
  return (
    <form action={action} className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <h2 className="font-semibold">Hero section</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Title lead</label>
          <input name="titleLead" defaultValue={hero.titleLead} className="input" />
        </div>
        <div>
          <label className="label">Title highlight</label>
          <input name="titleHighlight" defaultValue={hero.titleHighlight} className="input" />
        </div>
        <div>
          <label className="label">Title tail</label>
          <input name="titleTail" defaultValue={hero.titleTail} className="input" />
        </div>
      </div>
      <div>
        <label className="label">Badge (use {'{rating}'} for the live rating)</label>
        <input name="badge" defaultValue={hero.badge} className="input" />
      </div>
      <div>
        <label className="label">Subtitle</label>
        <textarea name="subtitle" defaultValue={hero.subtitle} rows={2} className="input resize-y" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Primary CTA label</label>
          <input name="primaryCtaLabel" defaultValue={hero.primaryCtaLabel} className="input" />
        </div>
        <div>
          <label className="label">Primary CTA link</label>
          <input name="primaryCtaHref" defaultValue={hero.primaryCtaHref} className="input" />
        </div>
        <div>
          <label className="label">Secondary CTA label</label>
          <input name="secondaryCtaLabel" defaultValue={hero.secondaryCtaLabel} className="input" />
        </div>
        <div>
          <label className="label">Secondary CTA link</label>
          <input name="secondaryCtaHref" defaultValue={hero.secondaryCtaHref} className="input" />
        </div>
      </div>
      <ImageField name="image" label="Hero image" defaultValue={hero.image} folder="home" />
      <div>
        <label className="label">Winner caption</label>
        <input name="winnerCaption" defaultValue={hero.winnerCaption} className="input" />
      </div>
      <div className="flex items-center gap-3">
        <Submit label="Save hero" />
        {state.success && <span className="text-sm text-emerald-600">{state.success}</span>}
      </div>
    </form>
  );
}

export function IconBlockForm({
  action,
  title,
  hint,
  items,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  title: string;
  hint: string;
  items: IconItem[];
}) {
  const [state, formAction] = useFormState<FormState, FormData>(action, {});
  const value = items.map((i) => `${i.icon} | ${i.title} | ${i.text}`).join('\n');
  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-xs text-ink/50">{hint}</p>
      <textarea name="items" defaultValue={value} rows={items.length + 2} className="input resize-y font-mono text-sm" />
      <div className="flex items-center gap-3">
        <Submit label="Save section" />
        {state.success && <span className="text-sm text-emerald-600">{state.success}</span>}
      </div>
    </form>
  );
}

export function ReviewCreateForm() {
  const [state, action] = useFormState<FormState, FormData>(createReviewAction, {});
  return (
    <form action={action} className="flex flex-wrap items-end gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div>
        <label className="label">Name</label>
        <input name="name" required className="input" />
      </div>
      <div>
        <label className="label">Location</label>
        <input name="location" className="input w-32" />
      </div>
      <div>
        <label className="label">Rating</label>
        <select name="rating" defaultValue="5" className="input w-20">
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      <div className="min-w-[200px] flex-1">
        <label className="label">Quote</label>
        <input name="quote" required className="input" />
      </div>
      <Submit label="Add review" />
      {state.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="w-full text-sm text-emerald-600">{state.success}</p>}
    </form>
  );
}
