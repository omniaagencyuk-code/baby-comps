'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateSettingsAction, type FormState } from '@/lib/actions/admin';
import { ImageField } from './image-field';

const FIELDS: { key: string; label: string; hint?: string; multiline?: boolean }[] = [
  { key: 'site.tagline', label: 'Homepage tagline' },
  { key: 'site.announcement', label: 'Announcement bar text' },
  { key: 'trust.entriesToDate', label: 'Entries to date (display)' },
  { key: 'trust.prizesGiven', label: 'Prizes given (display)' },
  { key: 'trust.rating', label: 'Average rating (display)' },
  {
    key: 'postal.address',
    label: 'Free postal entry (AMOE) address',
    hint: 'Shown on the Free Postal Entry page. Put each line on its own line.',
    multiline: true,
  },
];

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary px-6 py-2.5">
      {pending ? 'Saving…' : 'Save settings'}
    </button>
  );
}

export function SettingsForm({ values }: { values: Record<string, string> }) {
  const [state, action] = useFormState<FormState, FormData>(updateSettingsAction, {});
  return (
    <form action={action} className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="space-y-4 border-b border-black/5 pb-4">
        <ImageField
          name="setting.brand.logoUrl"
          label="Site logo"
          defaultValue={values['brand.logoUrl'] ?? ''}
          folder="brand"
          hint="Shown in the header and footer. Leave blank to use the text logo. Transparent PNG or wide logo works best."
        />
        <div className="max-w-xs">
          <label className="label" htmlFor="brand.logoHeight">Logo height (px)</label>
          <input
            id="brand.logoHeight"
            name="setting.brand.logoHeight"
            type="number"
            min={32}
            max={120}
            placeholder="64"
            defaultValue={values['brand.logoHeight'] ?? ''}
            className="input"
          />
          <p className="mt-1 text-xs text-ink/50">
            Header logo height in pixels (32–120). Bigger = more zoomed in. Try 80–100 for a square logo.
          </p>
        </div>
      </div>
      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className="label" htmlFor={f.key}>{f.label}</label>
          {f.multiline ? (
            <textarea
              id={f.key}
              name={`setting.${f.key}`}
              defaultValue={values[f.key] ?? ''}
              rows={4}
              className="input resize-y"
            />
          ) : (
            <input
              id={f.key}
              name={`setting.${f.key}`}
              defaultValue={values[f.key] ?? ''}
              className="input"
            />
          )}
          {f.hint && <p className="mt-1 text-xs text-ink/50">{f.hint}</p>}
        </div>
      ))}
      <div className="flex items-center gap-3">
        <Btn />
        {state.success && <span className="text-sm text-emerald-600">{state.success}</span>}
      </div>
    </form>
  );
}
