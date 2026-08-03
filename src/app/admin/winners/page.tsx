import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { Badge } from '@/components/ui/badge';
import { ConfirmSubmit } from '@/components/admin/confirm-submit';
import { WinnerEditForm } from '@/components/admin/winner-edit-form';
import { drawWinnerAction, updateWinnerAction } from '@/lib/actions/admin';

export const dynamic = 'force-dynamic';

export default async function AdminWinnersPage() {
  const now = new Date();
  const [readyToDraw, winners] = await Promise.all([
    prisma.competition.findMany({
      where: { status: { in: ['PUBLISHED', 'CLOSED'] }, closingDate: { lt: now }, winner: null },
      orderBy: { closingDate: 'asc' },
    }),
    prisma.winner.findMany({
      orderBy: { drawnAt: 'desc' },
      include: { competition: { select: { title: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Winners" description="Draw winners and manage the winners gallery." />

      <section>
        <h2 className="mb-3 font-semibold">Ready to draw ({readyToDraw.length})</h2>
        {readyToDraw.length === 0 ? (
          <AdminCard className="p-6 text-sm text-ink/50">
            No competitions are awaiting a draw. Competitions appear here once their closing date has
            passed.
          </AdminCard>
        ) : (
          <div className="space-y-3">
            {readyToDraw.map((c) => (
              <AdminCard key={c.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-ink/50">
                    Closed {formatDate(c.closingDate)} · {c.entriesSold} entries
                  </p>
                </div>
                <form action={drawWinnerAction.bind(null, c.id)}>
                  <ConfirmSubmit
                    confirm={`Draw a winner for "${c.title}"? This selects a random valid entry.`}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    🎲 Draw winner
                  </ConfirmSubmit>
                </form>
              </AdminCard>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-semibold">Winners ({winners.length})</h2>
        {winners.length === 0 ? (
          <AdminCard className="p-6 text-sm text-ink/50">No winners drawn yet.</AdminCard>
        ) : (
          <div className="space-y-3">
            {winners.map((w) => (
              <AdminCard key={w.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{w.competition.title}</p>
                    <p className="text-xs text-ink/50">
                      Ticket #{w.ticketNumber ?? '—'} · Drawn {formatDate(w.drawnAt)}
                    </p>
                  </div>
                  <Badge tone={w.published ? 'green' : 'amber'}>
                    {w.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <WinnerEditForm
                  action={updateWinnerAction.bind(null, w.id)}
                  values={{
                    name: w.name,
                    location: w.location ?? '',
                    quote: w.quote ?? '',
                    image: w.image ?? '',
                    published: w.published,
                  }}
                />
              </AdminCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
