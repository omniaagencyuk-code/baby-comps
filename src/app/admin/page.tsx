import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatMoney, formatDate, soldPercent } from '@/lib/utils';
import { AdminPageHeader, StatCard, AdminCard } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [revenue, paidOrders, entries, customers, liveComps, recentOrders, topComps] =
    await Promise.all([
      prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { total: true } }),
      prisma.order.count({ where: { status: 'PAID' } }),
      prisma.entry.count({ where: { status: 'CONFIRMED' } }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.competition.count({ where: { status: 'PUBLISHED' } }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: { user: { select: { email: true } }, items: true },
      }),
      prisma.competition.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { entriesSold: 'desc' },
        take: 5,
        select: { id: true, title: true, entriesSold: true, maxEntries: true, ticketPrice: true },
      }),
    ]);

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="Overview of your competition platform." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue (paid)" value={formatMoney(revenue._sum.total ?? 0)} />
        <StatCard label="Paid orders" value={paidOrders.toLocaleString()} />
        <StatCard label="Entries sold" value={entries.toLocaleString()} />
        <StatCard label="Customers" value={customers.toLocaleString()} hint={`${liveComps} live competitions`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-brand-600">
              View all
            </Link>
          </div>
          <div className="divide-y divide-black/5">
            {recentOrders.length === 0 && <p className="py-4 text-sm text-ink/50">No orders yet.</p>}
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs">{o.orderNumber}</p>
                  <p className="truncate text-xs text-ink/50">{o.user.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatMoney(o.total)}</p>
                  <p className="text-xs text-ink/40">{formatDate(o.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Top competitions</h2>
            <Link href="/admin/competitions" className="text-sm font-semibold text-brand-600">
              Manage
            </Link>
          </div>
          <div className="space-y-3">
            {topComps.length === 0 && <p className="text-sm text-ink/50">No competitions yet.</p>}
            {topComps.map((c) => (
              <div key={c.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="truncate">{c.title}</span>
                  <span className="text-ink/50">
                    {c.entriesSold}/{c.maxEntries}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${soldPercent(c.entriesSold, c.maxEntries)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
