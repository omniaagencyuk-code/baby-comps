'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const groups = [
  {
    title: 'Sell',
    links: [
      { href: '/admin', label: 'Dashboard', icon: '📊' },
      { href: '/admin/competitions', label: 'Competitions', icon: '🎁' },
      { href: '/admin/orders', label: 'Orders', icon: '🧾' },
      { href: '/admin/customers', label: 'Customers', icon: '👥' },
      { href: '/admin/winners', label: 'Winners', icon: '🏆' },
    ],
  },
  {
    title: 'Content',
    links: [
      { href: '/admin/blog', label: 'Blog', icon: '✍️' },
      { href: '/admin/media', label: 'Media', icon: '🖼️' },
      { href: '/admin/coupons', label: 'Coupons', icon: '🏷️' },
    ],
  },
  {
    title: 'System',
    links: [
      { href: '/admin/email', label: 'Email', icon: '✉️' },
      { href: '/admin/reports', label: 'Reports', icon: '📈' },
      { href: '/admin/seo', label: 'SEO', icon: '🔍' },
      { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
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
                  <span aria-hidden>{l.icon}</span>
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
