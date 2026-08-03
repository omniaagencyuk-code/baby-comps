'use client';

import { useState } from 'react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <section className="py-16">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-6 py-12 text-center text-white sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="relative mx-auto max-w-xl">
            <h2 className="text-2xl font-bold sm:text-3xl">Never miss a competition</h2>
            <p className="mt-2 text-white/80">
              Get early access to new prizes, exclusive discount codes and winner announcements.
            </p>
            {done ? (
              <p className="mt-6 rounded-xl bg-white/15 px-4 py-3 font-medium">
                🎉 You&apos;re in! Check your inbox to confirm.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setDone(true);
                }}
                className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 rounded-full border-0 px-5 py-3 text-ink outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-ink px-6 py-3 font-semibold text-white transition hover:bg-black"
                >
                  Subscribe
                </button>
              </form>
            )}
            <p className="mt-3 text-xs text-white/60">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
