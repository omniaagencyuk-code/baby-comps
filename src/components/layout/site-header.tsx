import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import type { SessionPayload } from '@/lib/auth';
import { MobileNav } from './mobile-nav';
import { Icon } from '@/components/ui/icon';

export function SiteHeader({
  session,
  announcement,
  logoUrl,
  logoHeight,
}: {
  session: SessionPayload | null;
  announcement?: string;
  logoUrl?: string;
  logoHeight?: string;
}) {
  // Header logo height in px, admin-controlled (default 64), clamped to a sane range.
  const h = Math.min(120, Math.max(32, Number(logoHeight) || 64));
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/90 backdrop-blur">
      {announcement && (
        <div className="bg-brand-600 py-1.5 text-center text-xs font-medium text-white">
          {announcement}
        </div>
      )}
      <div className="container flex min-h-[72px] items-center justify-between gap-4 py-2">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold" aria-label={siteConfig.name}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteConfig.name} style={{ height: h }} className="w-auto" />
          ) : (
            <>
              <span aria-hidden className="text-2xl">🧸</span>
              <span className="leading-tight">
                Tiny <span className="text-brand-600">Treasure</span>
              </span>
            </>
          )}
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
          <Link
            href="/competitions"
            aria-label="Search competitions"
            className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-brand-50 hover:text-brand-600"
          >
            <Icon name="search" className="text-[22px]" />
          </Link>
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
