import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/utils';
import { AdminPageHeader, StatCard, AdminCard } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  const [revenue, refunded, orderCount, avgOrder, byCompetition] = await Promise.all([
    prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { status: 'REFUNDED' }, _sum: { total: true } }),
    prisma.order.count({ where: { status: 'PAID' } }),
    prisma.order.aggregate({ where: { status: 'PAID' }, _avg: { total: true } }),
    prisma.orderItem.groupBy({
      by: ['competitionTitle'],
      _sum: { lineTotal: true, quantity: true },
      orderBy: { _sum: { lineTotal: 'desc' } },
      take: 10,
    }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Reports" description="Sales performance at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Gross revenue" value={formatMoney(revenue._sum.total ?? 0)} />
        <StatCard label="Refunded" value={formatMoney(refunded._sum.total ?? 0)} />
        <StatCard label="Paid orders" value={orderCount.toLocaleString()} />
        <StatCard label="Avg order value" value={formatMoney(Math.round(avgOrder._avg.total ?? 0))} />
      </div>

      <AdminCard className="p-5">
        <h2 className="mb-4 font-semibold">Revenue by competition</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-ink/50">
                <th className="py-2 font-medium">Competition</th>
                <th className="py-2 text-right font-medium">Entries</th>
                <th className="py-2 text-right font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {byCompetition.length === 0 && (
                <tr><td colSpan={3} className="py-6 text-center text-ink/50">No sales data yet.</td></tr>
              )}
              {byCompetition.map((r) => (
                <tr key={r.competitionTitle} className="border-b border-black/5 last:border-0">
                  <td className="py-2">{r.competitionTitle}</td>
                  <td className="py-2 text-right">{r._sum.quantity ?? 0}</td>
                  <td className="py-2 text-right font-semibold">{formatMoney(r._sum.lineTotal ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
