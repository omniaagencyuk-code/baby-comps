import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface WinnerItem {
  id: string;
  name: string;
  location: string | null;
  prizeTitle: string;
  image: string | null;
  quote: string | null;
  drawnAt: Date;
}

export function WinnerShowcase({ winners }: { winners: WinnerItem[] }) {
  if (winners.length === 0) return null;
  const [featured, ...rest] = winners;

  return (
    <section className="bg-gradient-to-b from-cream to-brand-50 py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-600">
            Real winners
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">Life-changing prizes, every week</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card overflow-hidden">
            <div className="grid sm:grid-cols-2">
              {featured.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featured.image}
                  alt={`${featured.name} winning ${featured.prizeTitle}`}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="p-6">
                <p className="text-sm font-semibold text-brand-600">
                  {featured.name}
                  {featured.location ? ` · ${featured.location}` : ''}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold">{featured.prizeTitle}</h3>
                {featured.quote && (
                  <blockquote className="mt-3 text-ink/70">“{featured.quote}”</blockquote>
                )}
                <p className="mt-4 text-xs text-ink/50">Drawn {formatDate(featured.drawnAt)}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {rest.slice(0, 4).map((w) => (
              <div key={w.id} className="card flex flex-col p-4">
                {w.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={w.image} alt={w.prizeTitle} className="mb-3 h-28 w-full rounded-xl object-cover" />
                )}
                <p className="text-sm font-semibold">{w.name}</p>
                <p className="text-xs text-ink/60">{w.prizeTitle}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/winners" className="btn-secondary px-6 py-3">
            View all winners
          </Link>
        </div>
      </div>
    </section>
  );
}
