import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney, formatDate } from '@/lib/utils';
import { ButtonLink } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function AccountOverview() {
  const session = await requireUser();
  const userId = session.userId;

  const [entryCount, orderCount, winCount, recentOrders, activeComps] = await Promise.all([
    prisma.entry.count({ where: { userId, status: 'CONFIRMED' } }),
    prisma.order.count({ where: { userId, status: 'PAID' } }),
    prisma.winner.count({ where: { userId } }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { items: true },
    }),
    prisma.entry.findMany({
      where: { userId, status: 'CONFIRMED', competition: { status: 'PUBLISHED' } },
      distinct: ['competitionId'],
      include: { competition: { select: { title: true, slug: true, drawDate: true } } },
      take: 4,
    }),
  ]);

  const stats = [
    { label: 'Total entries', value: entryCount.toLocaleString(), icon: '🎫' },
    { label: 'Orders', value: orderCount.toLocaleString(), icon: '🧾' },
    { label: 'Wins', value: winCount.toLocaleString(), icon: '🏆' },
    { label: 'Live draws', value: activeComps.length.toLocaleString(), icon: '⏳' },
  ];

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="text-2xl">{s.icon}</div>
            <p className="mt-2 text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-ink/60">{s.label}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Live competitions you&apos;re in</h2>
          <Link href="/account/entries" className="text-sm font-semibold text-brand-600">
            All entries →
          </Link>
        </div>
        {activeComps.length === 0 ? (
          <div className="card flex flex-col items-center p-8 text-center">
            <p className="text-ink/60">You haven&apos;t entered any live competitions yet.</p>
            <ButtonLink href="/competitions" className="mt-4">
              Browse competitions
            </ButtonLink>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {activeComps.map((e) => (
              <Link
                key={e.competitionId}
                href={`/competitions/${e.competition.slug}`}
                className="card flex items-center justify-between p-4 hover:shadow-card-hover"
              >
                <div>
                  <p className="font-medium">{e.competition.title}</p>
                  <p className="text-xs text-ink/50">Draws {formatDate(e.competition.drawDate)}</p>
                </div>
                <span className="text-brand-600">→</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link href="/account/orders" className="text-sm font-semibold text-brand-600">
            All orders →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-ink/50">No orders yet.</p>
        ) : (
          <div className="card divide-y divide-black/5">
            {recentOrders.map((o) => (
              <Link
                key={o.id}
                href={`/account/orders/${o.id}`}
                className="flex items-center justify-between p-4 hover:bg-brand-50/50"
              >
                <div>
                  <p className="font-mono text-sm">{o.orderNumber}</p>
                  <p className="text-xs text-ink/50">{formatDate(o.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatMoney(o.total)}</p>
                  <span className="text-xs text-ink/50">{o.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
