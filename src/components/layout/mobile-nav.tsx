'use client';

import Link from 'next/link';
import { useState } from 'react';
import { siteConfig } from '@/lib/site';
import type { SessionPayload } from '@/lib/auth';

export function MobileNav({ session }: { session: SessionPayload | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={open}
        className="rounded-lg p-2 text-ink hover:bg-black/5"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-black/5 bg-cream shadow-lg">
          <nav className="container flex flex-col gap-1 py-4">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 font-medium text-ink/80 hover:bg-brand-50"
              >
                {item.label}
              </Link>
            ))}
            <hr className="my-2 border-black/5" />
            {session ? (
              <>
                {session.role === 'ADMIN' && (
                  <Link href="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-medium">
                    Admin
                  </Link>
                )}
                <Link href="/account" onClick={() => setOpen(false)} className="btn-primary mt-1 py-2.5">
                  My account
                </Link>
              </>
            ) : (
              <div className="mt-1 flex gap-2">
                <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary flex-1 py-2.5">
                  Log in
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="btn-primary flex-1 py-2.5">
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
