'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateProfileAction, type ProfileState } from '@/lib/actions/profile';

interface Props {
  defaults: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postcode: string;
    marketingOptIn: boolean;
  };
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary px-6 py-2.5">
      {pending ? 'Saving…' : 'Save changes'}
    </button>
  );
}

export function ProfileForm({ defaults }: Props) {
  const [state, action] = useFormState<ProfileState, FormData>(updateProfileAction, {});

  return (
    <form action={action} className="card space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Full name
          </label>
          <input id="name" name="name" defaultValue={defaults.name} required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" defaultValue={defaults.phone} className="input" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="addressLine1">
          Address line 1
        </label>
        <input
          id="addressLine1"
          name="addressLine1"
          defaultValue={defaults.addressLine1}
          className="input"
        />
      </div>
      <div>
        <label className="label" htmlFor="addressLine2">
          Address line 2
        </label>
        <input
          id="addressLine2"
          name="addressLine2"
          defaultValue={defaults.addressLine2}
          className="input"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="city">
            Town / City
          </label>
          <input id="city" name="city" defaultValue={defaults.city} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="postcode">
            Postcode
          </label>
          <input id="postcode" name="postcode" defaultValue={defaults.postcode} className="input" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          name="marketingOptIn"
          defaultChecked={defaults.marketingOptIn}
          className="accent-brand-600"
        />
        Email me new competitions and exclusive discount codes.
      </label>

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          ✔ Profile updated.
        </p>
      )}

      <SaveButton />
    </form>
  );
}
