'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/lib/actions/auth';

const links = [
  { href: '/account', label: 'Overview', icon: '🏠' },
  { href: '/account/entries', label: 'My entries', icon: '🎫' },
  { href: '/account/orders', label: 'Orders', icon: '🧾' },
  { href: '/account/wins', label: 'My wins', icon: '🏆' },
  { href: '/account/saved', label: 'Saved', icon: '❤️' },
  { href: '/account/profile', label: 'Profile', icon: '⚙️' },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              active ? 'bg-brand-600 text-white' : 'text-ink/70 hover:bg-brand-50'
            }`}
          >
            <span aria-hidden>{l.icon}</span>
            {l.label}
          </Link>
        );
      })}
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-red-50 hover:text-red-600"
        >
          <span aria-hidden>↩️</span> Log out
        </button>
      </form>
    </nav>
  );
}
