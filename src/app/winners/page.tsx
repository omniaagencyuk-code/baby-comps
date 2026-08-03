import type { Metadata } from 'next';
import { getPublishedWinners } from '@/lib/competitions';
import { formatDate, formatMoney } from '@/lib/utils';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Winners Gallery',
  description:
    'Meet the real families who have won with Tiny Treasure Competitions. Every winner published.',
  alternates: { canonical: '/winners' },
};

export default async function WinnersPage() {
  const winners = await getPublishedWinners();

  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: 'Winners' }]} />
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold">Winners gallery</h1>
        <p className="mt-2 text-ink/60">
          We publish every single winner. Real families, real prizes, drawn fairly.
        </p>
      </div>

      {winners.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-ink/50">
          Our first winners will appear here very soon!
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {winners.map((w) => (
            <article key={w.id} className="card overflow-hidden">
              {w.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={w.image} alt={w.prizeTitle} className="aspect-[4/3] w-full object-cover" />
              )}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-brand-600">{w.name}</p>
                  {w.ticketNumber && (
                    <span className="text-xs text-ink/50">Ticket #{w.ticketNumber}</span>
                  )}
                </div>
                {w.location && <p className="text-xs text-ink/50">{w.location}</p>}
                <h3 className="mt-1 font-display font-semibold">{w.prizeTitle}</h3>
                {w.competition?.retailValue ? (
                  <p className="text-sm text-ink/60">Worth {formatMoney(w.competition.retailValue)}</p>
                ) : null}
                {w.quote && <blockquote className="mt-3 text-sm text-ink/70">“{w.quote}”</blockquote>}
                <p className="mt-3 text-xs text-ink/40">Drawn {formatDate(w.drawnAt)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
