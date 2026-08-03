import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

const statusTone = {
  PAID: 'green',
  PENDING: 'amber',
  REFUNDED: 'slate',
  CANCELLED: 'slate',
  FAILED: 'red',
} as const;

export default async function OrdersPage() {
  const session = await requireUser();
  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Orders</h2>
      {orders.length === 0 ? (
        <div className="card p-8 text-center text-ink/60">You have no orders yet.</div>
      ) : (
        <div className="card divide-y divide-black/5">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/account/orders/${o.id}`}
              className="flex items-center justify-between gap-4 p-4 hover:bg-brand-50/50"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm">{o.orderNumber}</p>
                <p className="truncate text-xs text-ink/50">
                  {o.items.map((i) => `${i.quantity}× ${i.competitionTitle}`).join(', ')}
                </p>
                <p className="text-xs text-ink/40">{formatDate(o.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatMoney(o.total)}</p>
                <Badge tone={statusTone[o.status] ?? 'slate'}>{o.status}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
