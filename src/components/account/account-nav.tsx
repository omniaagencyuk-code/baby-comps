'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/lib/actions/auth';
import { Icon } from '@/components/ui/icon';

const links = [
  { href: '/account', label: 'Overview', icon: 'grid_view' },
  { href: '/account/entries', label: 'My entries', icon: 'confirmation_number' },
  { href: '/account/orders', label: 'Orders', icon: 'receipt_long' },
  { href: '/account/wins', label: 'My wins', icon: 'emoji_events' },
  { href: '/account/saved', label: 'Saved', icon: 'favorite' },
  { href: '/account/profile', label: 'Profile', icon: 'settings' },
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
            <Icon name={l.icon} className="text-[20px]" />
            {l.label}
          </Link>
        );
      })}
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-red-50 hover:text-red-600"
        >
          <Icon name="logout" className="text-[20px]" /> Log out
        </button>
      </form>
    </nav>
  );
}
