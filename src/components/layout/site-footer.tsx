import Link from 'next/link';
import { siteConfig } from '@/lib/site';

const columns = [
  {
    title: 'Competitions',
    links: [
      { label: 'All competitions', href: '/competitions' },
      { label: 'Ending soon', href: '/competitions?sort=ending' },
      { label: 'Winners', href: '/winners' },
      { label: 'How it works', href: '/#how-it-works' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Guides', href: '/guides' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Free Postal Entry', href: '/free-entry' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Responsible Play', href: '/responsible-play' },
    ],
  },
];

export function SiteFooter({ logoUrl, logoHeight }: { logoUrl?: string; logoHeight?: string }) {
  const h = Math.min(160, Math.round(Math.min(120, Math.max(32, Number(logoHeight) || 64)) * 1.3));
  return (
    <footer className="mt-16 border-t border-black/5 bg-white">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 font-display text-lg font-bold" aria-label={siteConfig.name}>
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={siteConfig.name} style={{ height: h }} className="w-auto" />
              ) : (
                <>
                  <span aria-hidden className="text-2xl">🧸</span>
                  Tiny <span className="text-brand-600">Treasure</span>
                </>
              )}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink/60">{siteConfig.description}</p>
            <div className="mt-4 flex gap-3 text-sm text-ink/60">
              <a href={siteConfig.social.instagram} className="hover:text-brand-600">Instagram</a>
              <a href={siteConfig.social.facebook} className="hover:text-brand-600">Facebook</a>
              <a href={siteConfig.social.tiktok} className="hover:text-brand-600">TikTok</a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink/50">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-ink/70 hover:text-brand-600">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-6 text-center text-xs text-ink/50 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved. Must be 18+ and a UK
            resident to enter. Please play responsibly.
          </p>
          <p>
            No purchase necessary. A{' '}
            <Link href="/free-entry" className="font-semibold text-brand-700 hover:underline">
              free postal entry route
            </Link>{' '}
            is always available.
          </p>
        </div>
      </div>
    </footer>
  );
}
