import type { Metadata } from 'next';
import Link from 'next/link';
import { listCompetitions, getCategories, type ListParams } from '@/lib/competitions';
import { CompetitionGrid } from '@/components/competition/competition-grid';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'All Competitions',
  description: 'Browse all live UK baby and family prize competitions. Enter to win for less.',
  alternates: { canonical: '/competitions' },
};

const sortOptions = [
  { value: 'ending', label: 'Ending soon' },
  { value: 'new', label: 'Newest' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'value', label: 'Prize value' },
];

export default async function CompetitionsPage({
  searchParams,
}: {
  searchParams: { sort?: string; category?: string; page?: string };
}) {
  const sort = (searchParams.sort as ListParams['sort']) || 'ending';
  const category = searchParams.category;
  const page = Number(searchParams.page) || 1;

  const [{ items, total, pages }, categories] = await Promise.all([
    listCompetitions({ sort, category, page }),
    getCategories(),
  ]);

  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { sort, category, ...overrides };
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    const qs = params.toString();
    return qs ? `/competitions?${qs}` : '/competitions';
  };

  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: 'Competitions' }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Live competitions</h1>
        <p className="mt-2 text-ink/60">{total} competitions open for entry right now.</p>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={buildQuery({ category: undefined, page: undefined })}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            !category ? 'bg-brand-600 text-white' : 'bg-white text-ink/70 hover:bg-brand-50'
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={buildQuery({ category: c.slug, page: undefined })}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              category === c.slug ? 'bg-brand-600 text-white' : 'bg-white text-ink/70 hover:bg-brand-50'
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Sort */}
      <div className="mb-6 flex flex-wrap gap-2 text-sm">
        <span className="py-1.5 text-ink/50">Sort:</span>
        {sortOptions.map((o) => (
          <Link
            key={o.value}
            href={buildQuery({ sort: o.value, page: undefined })}
            className={`rounded-full px-3 py-1.5 font-medium ${
              sort === o.value ? 'bg-ink text-white' : 'text-ink/60 hover:text-brand-600'
            }`}
          >
            {o.label}
          </Link>
        ))}
      </div>

      <CompetitionGrid competitions={items} />

      {/* Pagination */}
      {pages > 1 && (
        <nav className="mt-10 flex justify-center gap-2" aria-label="Pagination">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildQuery({ page: String(p) })}
              className={`h-10 w-10 rounded-full text-center text-sm leading-10 ${
                p === page ? 'bg-brand-600 text-white' : 'bg-white text-ink/70 hover:bg-brand-50'
              }`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
