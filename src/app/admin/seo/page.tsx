import { prisma } from '@/lib/prisma';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function AdminSeoPage() {
  const [missingMeta, unpublished] = await Promise.all([
    prisma.competition.count({ where: { status: 'PUBLISHED', metaDescription: null } }),
    prisma.competition.count({ where: { status: 'DRAFT' } }),
  ]);

  const checks = [
    { label: 'Dynamic metadata per page', done: true },
    { label: 'Canonical URLs', done: true },
    { label: 'XML sitemap at /sitemap.xml', done: true },
    { label: 'robots.txt at /robots.txt', done: true },
    { label: 'JSON-LD (Product, FAQ, Breadcrumb, Article)', done: true },
    { label: 'Open Graph + Twitter cards', done: true },
    { label: 'Core Web Vitals (next/font, image optimisation)', done: true },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="SEO" description="Search visibility health." />
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminCard className="p-5">
          <p className="text-sm text-ink/50">Published competitions missing meta description</p>
          <p className={`mt-1 text-2xl font-bold ${missingMeta ? 'text-amber-600' : 'text-emerald-600'}`}>
            {missingMeta}
          </p>
        </AdminCard>
        <AdminCard className="p-5">
          <p className="text-sm text-ink/50">Draft competitions (not indexed)</p>
          <p className="mt-1 text-2xl font-bold">{unpublished}</p>
        </AdminCard>
      </div>
      <AdminCard className="p-5">
        <h2 className="mb-3 font-semibold">SEO checklist</h2>
        <ul className="space-y-2 text-sm">
          {checks.map((c) => (
            <li key={c.label} className="flex items-center gap-2">
              <span className={c.done ? 'text-emerald-600' : 'text-ink/30'}>
                {c.done ? '✓' : '○'}
              </span>
              {c.label}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-4 text-sm">
          <a href="/sitemap.xml" target="_blank" className="font-semibold text-brand-600">
            View sitemap →
          </a>
          <a href="/robots.txt" target="_blank" className="font-semibold text-brand-600">
            View robots.txt →
          </a>
        </div>
      </AdminCard>
    </div>
  );
}
