'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createCouponAction, type FormState } from '@/lib/actions/admin';

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary px-5 py-2.5">
      {pending ? 'Creating…' : 'Create coupon'}
    </button>
  );
}

export function CouponForm() {
  const [state, action] = useFormState<FormState, FormData>(createCouponAction, {});
  return (
    <form action={action} className="flex flex-wrap items-end gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div>
        <label className="label" htmlFor="code">Code</label>
        <input id="code" name="code" placeholder="WELCOME10" required className="input uppercase" />
      </div>
      <div>
        <label className="label" htmlFor="type">Type</label>
        <select id="type" name="type" className="input">
          <option value="PERCENT">Percent %</option>
          <option value="FIXED">Fixed £</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="value">Value</label>
        <input id="value" name="value" type="number" step="0.01" min="0" required className="input w-28" />
      </div>
      <Btn />
      {state.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="w-full text-sm text-emerald-600">{state.success}</p>}
    </form>
  );
}
