'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/icon';

const groups = [
  {
    title: 'Sell',
    links: [
      { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
      { href: '/admin/competitions', label: 'Competitions', icon: 'redeem' },
      { href: '/admin/categories', label: 'Categories', icon: 'category' },
      { href: '/admin/orders', label: 'Orders', icon: 'receipt_long' },
      { href: '/admin/customers', label: 'Customers', icon: 'group' },
      { href: '/admin/winners', label: 'Winners', icon: 'emoji_events' },
    ],
  },
  {
    title: 'Content',
    links: [
      { href: '/admin/content', label: 'Homepage', icon: 'home' },
      { href: '/admin/pages', label: 'Pages', icon: 'description' },
      { href: '/admin/blog', label: 'Blog', icon: 'edit_note' },
      { href: '/admin/media', label: 'Media', icon: 'image' },
      { href: '/admin/coupons', label: 'Coupons', icon: 'sell' },
    ],
  },
  {
    title: 'System',
    links: [
      { href: '/admin/email', label: 'Email', icon: 'mail' },
      { href: '/admin/reports', label: 'Reports', icon: 'monitoring' },
      { href: '/admin/seo', label: 'SEO', icon: 'search' },
      { href: '/admin/settings', label: 'Settings', icon: 'settings' },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-6">
      {groups.map((g) => (
        <div key={g.title}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            {g.title}
          </p>
          <div className="space-y-0.5">
            {g.links.map((l) => {
              const active = l.href === '/admin' ? pathname === l.href : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                    active ? 'bg-white/15 font-semibold text-white' : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Icon name={l.icon} className="text-[20px]" />
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
