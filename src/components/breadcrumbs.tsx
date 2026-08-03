import Link from 'next/link';
import { siteConfig } from '@/lib/site';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: 'Home', href: '/' }, ...items];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${siteConfig.url}${c.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink/50">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className="hover:text-brand-600">
                {c.label}
              </Link>
            ) : (
              <span className="text-ink/70">{c.label}</span>
            )}
            {i < all.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
