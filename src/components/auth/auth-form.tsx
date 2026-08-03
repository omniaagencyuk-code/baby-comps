'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { registerAction, loginAction, type AuthState } from '@/lib/actions/auth';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full py-3">
      {pending ? 'Please wait…' : label}
    </button>
  );
}

export function AuthForm({ mode, next }: { mode: 'login' | 'register'; next?: string }) {
  const action = mode === 'login' ? loginAction : registerAction;
  const [state, formAction] = useFormState<AuthState, FormData>(action, {});

  return (
    <div className="card mx-auto w-full max-w-md p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          {mode === 'login'
            ? 'Log in to view your entries and orders.'
            : 'Join and start entering in seconds.'}
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {next && <input type="hidden" name="next" value={next} />}

        {mode === 'register' && (
          <div>
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input id="name" name="name" required autoComplete="name" className="input" />
          </div>
        )}

        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input"
          />
        </div>

        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={mode === 'register' ? 8 : undefined}
            className="input"
          />
        </div>

        {mode === 'register' && (
          <label className="flex items-start gap-2 text-sm text-ink/70">
            <input type="checkbox" name="marketingOptIn" className="mt-1 accent-brand-600" />
            Email me new competitions and exclusive discount codes.
          </label>
        )}

        {state.error && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700" role="alert">
            {state.error}
          </p>
        )}

        <SubmitButton label={mode === 'login' ? 'Log in' : 'Create account'} />
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        {mode === 'login' ? (
          <>
            New here?{' '}
            <Link href="/register" className="font-semibold text-brand-600">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-600">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
