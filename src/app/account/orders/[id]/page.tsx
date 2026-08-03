import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ConfirmSubmit } from '@/components/admin/confirm-submit';
import { cancelMyPendingOrderAction } from '@/lib/actions/customer-orders';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await requireUser();
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: true,
      entries: { orderBy: { ticketNumber: 'asc' } },
      payment: true,
      coupon: true,
    },
  });

  if (!order || order.userId !== session.userId) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/account/orders" className="text-sm text-brand-600 hover:underline">
          ← Back to orders
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Order {order.orderNumber}</h2>
          <Badge tone={order.status === 'PAID' ? 'green' : 'slate'}>{order.status}</Badge>
        </div>
        <p className="text-sm text-ink/50">Placed {formatDate(order.createdAt)}</p>
      </div>

      <div className="card p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50">
              <th className="pb-2 font-medium">Item</th>
              <th className="pb-2 text-center font-medium">Qty</th>
              <th className="pb-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((i) => (
              <tr key={i.id} className="border-t border-black/5">
                <td className="py-2">{i.competitionTitle}</td>
                <td className="py-2 text-center">{i.quantity}</td>
                <td className="py-2 text-right">{formatMoney(i.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-black/5">
              <td colSpan={2} className="py-1 text-right text-ink/60">
                Subtotal
              </td>
              <td className="py-1 text-right">{formatMoney(order.subtotal)}</td>
            </tr>
            {order.discount > 0 && (
              <tr>
                <td colSpan={2} className="py-1 text-right text-ink/60">
                  Discount {order.coupon ? `(${order.coupon.code})` : ''}
                </td>
                <td className="py-1 text-right text-emerald-600">−{formatMoney(order.discount)}</td>
              </tr>
            )}
            <tr>
              <td colSpan={2} className="py-1 text-right font-semibold">
                Total
              </td>
              <td className="py-1 text-right font-semibold">{formatMoney(order.total)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={`/api/orders/${order.id}/invoice`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary px-4 py-2 text-sm"
          >
            Download invoice
          </a>
          {order.status === 'PENDING' && (
            <form action={cancelMyPendingOrderAction.bind(null, order.id)}>
              <ConfirmSubmit
                confirm="Cancel this unpaid order? No payment has been taken and no tickets were issued."
                className="btn-ghost px-4 py-2 text-sm text-red-500"
              >
                Cancel unpaid order
              </ConfirmSubmit>
            </form>
          )}
        </div>
        {order.status === 'PENDING' && (
          <p className="mt-2 text-xs text-muted">
            This order is awaiting payment — no tickets have been issued yet.
          </p>
        )}
      </div>

      {order.entries.length > 0 && (
        <div className="card p-5">
          <h3 className="mb-3 font-semibold">Ticket numbers</h3>
          <div className="flex flex-wrap gap-1.5">
            {order.entries.map((e) => (
              <span
                key={e.id}
                className="rounded-md bg-brand-100 px-2 py-0.5 font-mono text-xs font-semibold text-brand-700"
              >
                #{e.ticketNumber}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
