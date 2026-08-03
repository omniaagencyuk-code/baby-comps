import { prisma } from '@/lib/prisma';
import { formatMoney, formatDate } from '@/lib/utils';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

const tone = {
  PAID: 'green',
  PENDING: 'amber',
  REFUNDED: 'slate',
  CANCELLED: 'slate',
  FAILED: 'red',
} as const;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { user: { select: { email: true, name: true } }, items: true },
  });

  return (
    <div>
      <AdminPageHeader title="Orders" description="All customer orders (latest 100)." />
      <AdminCard>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-ink/50">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ink/50">No orders yet.</td>
                </tr>
              )}
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-black/5 last:border-0">
                  <td className="p-4 font-mono text-xs">{o.orderNumber}</td>
                  <td className="p-4">{o.user.name || o.user.email}</td>
                  <td className="p-4 text-ink/60">
                    {o.items.reduce((sum, i) => sum + i.quantity, 0)} entries
                  </td>
                  <td className="p-4 font-semibold">{formatMoney(o.total)}</td>
                  <td className="p-4">
                    <Badge tone={tone[o.status] ?? 'slate'}>{o.status}</Badge>
                  </td>
                  <td className="p-4 text-ink/60">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
