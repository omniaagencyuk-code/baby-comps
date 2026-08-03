import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import type { SessionPayload } from '@/lib/auth';
import { MobileNav } from './mobile-nav';

export function SiteHeader({ session }: { session: SessionPayload | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/90 backdrop-blur">
      <div className="bg-brand-600 py-1.5 text-center text-xs font-medium text-white">
        Free UK delivery on all physical prizes · Trusted, verifiable draws
      </div>
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span aria-hidden className="text-2xl">🧸</span>
          <span className="leading-tight">
            Tiny <span className="text-brand-600">Treasure</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink/80 transition hover:text-brand-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              {session.role === 'ADMIN' && (
                <Link href="/admin" className="text-sm font-medium text-ink/70 hover:text-brand-600">
                  Admin
                </Link>
              )}
              <Link href="/account" className="btn-secondary px-4 py-2 text-sm">
                My account
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-ink/80 hover:text-brand-600">
                Log in
              </Link>
              <Link href="/register" className="btn-primary px-4 py-2 text-sm">
                Sign up
              </Link>
            </>
          )}
        </div>

        <MobileNav session={session} />
      </div>
    </header>
  );
}
