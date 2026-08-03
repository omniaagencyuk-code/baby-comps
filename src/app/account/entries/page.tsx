import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function EntriesPage() {
  const session = await requireUser();

  const entries = await prisma.entry.findMany({
    where: { userId: session.userId, status: 'CONFIRMED' },
    orderBy: { createdAt: 'desc' },
    include: {
      competition: { select: { title: true, slug: true, status: true, drawDate: true, winner: true } },
    },
  });

  // Group ticket numbers by competition.
  const byComp = new Map<
    string,
    { title: string; slug: string; status: string; drawDate: Date; tickets: number[]; won: boolean }
  >();
  for (const e of entries) {
    const key = e.competitionId;
    if (!byComp.has(key)) {
      byComp.set(key, {
        title: e.competition.title,
        slug: e.competition.slug,
        status: e.competition.status,
        drawDate: e.competition.drawDate,
        tickets: [],
        won: e.competition.winner?.userId === session.userId,
      });
    }
    byComp.get(key)!.tickets.push(e.ticketNumber);
  }

  const groups = Array.from(byComp.values());

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">My entries</h2>
      {groups.length === 0 ? (
        <div className="card p-8 text-center text-ink/60">
          You have no entries yet.{' '}
          <Link href="/competitions" className="font-semibold text-brand-600">
            Find a competition
          </Link>
          .
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((g) => (
            <div key={g.slug} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link href={`/competitions/${g.slug}`} className="font-semibold hover:text-brand-600">
                    {g.title}
                  </Link>
                  <p className="text-xs text-ink/50">
                    {g.status === 'DRAWN' ? 'Drawn' : 'Draws'} {formatDate(g.drawDate)}
                  </p>
                </div>
                {g.won ? (
                  <Badge tone="green">🏆 You won!</Badge>
                ) : g.status === 'DRAWN' ? (
                  <Badge tone="slate">Drawn</Badge>
                ) : (
                  <Badge tone="amber">Live</Badge>
                )}
              </div>
              <div className="mt-3">
                <p className="mb-1.5 text-xs text-ink/50">
                  {g.tickets.length} ticket{g.tickets.length === 1 ? '' : 's'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {g.tickets
                    .sort((a, b) => a - b)
                    .map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-brand-100 px-2 py-0.5 font-mono text-xs font-semibold text-brand-700"
                      >
                        #{t}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
