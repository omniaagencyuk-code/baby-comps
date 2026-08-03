import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatMoney, formatDate } from '@/lib/utils';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { Badge } from '@/components/ui/badge';
import { ConfirmSubmit } from '@/components/admin/confirm-submit';
import { isStripeConfigured } from '@/lib/stripe';
import {
  refundOrderAction,
  markOrderPaidAction,
  cancelOrderAction,
} from '@/lib/actions/orders';

export const dynamic = 'force-dynamic';

const tone = {
  PAID: 'green',
  PENDING: 'amber',
  REFUNDED: 'slate',
  CANCELLED: 'slate',
  FAILED: 'red',
} as const;

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: true,
      payment: true,
      coupon: true,
      entries: { orderBy: { ticketNumber: 'asc' } },
    },
  });
  if (!order) notFound();

  const stripeLinked = Boolean(order.stripePaymentIntentId || order.payment?.stripePaymentIntentId);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Order ${order.orderNumber}`}
        description={`Placed ${formatDate(order.createdAt)} by ${order.user.name || order.user.email}`}
        action={
          <Link href="/admin/orders" className="btn-ghost px-4 py-2 text-sm">
            ← All orders
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <AdminCard className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Items</h2>
            <Badge tone={tone[order.status] ?? 'slate'}>{order.status}</Badge>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {order.items.map((i) => (
                <tr key={i.id} className="border-b border-black/5">
                  <td className="py-2">{i.competitionTitle}</td>
                  <td className="py-2 text-center text-muted">×{i.quantity}</td>
                  <td className="py-2 text-right">{formatMoney(i.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="py-1 text-right text-muted">Subtotal</td>
                <td className="py-1 text-right">{formatMoney(order.subtotal)}</td>
              </tr>
              {order.discount > 0 && (
                <tr>
                  <td colSpan={2} className="py-1 text-right text-muted">
                    Discount {order.coupon ? `(${order.coupon.code})` : ''}
                  </td>
                  <td className="py-1 text-right text-emerald-600">−{formatMoney(order.discount)}</td>
                </tr>
              )}
              <tr>
                <td colSpan={2} className="py-1 text-right font-semibold">Total</td>
                <td className="py-1 text-right font-semibold">{formatMoney(order.total)}</td>
              </tr>
            </tfoot>
          </table>

          {order.entries.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold">Allocated tickets ({order.entries.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {order.entries.map((e) => (
                  <span key={e.id} className="rounded-md bg-brand-100 px-2 py-0.5 font-mono text-xs font-semibold text-brand-700">
                    #{e.ticketNumber}
                  </span>
                ))}
              </div>
            </div>
          )}
        </AdminCard>

        <div className="space-y-6">
          <AdminCard className="p-5">
            <h2 className="mb-3 font-semibold">Customer</h2>
            <p className="text-sm">{order.user.name || '—'}</p>
            <p className="text-sm text-muted">{order.user.email}</p>
            {order.user.phone && <p className="text-sm text-muted">{order.user.phone}</p>}
            {(order.user.addressLine1 || order.user.postcode) && (
              <p className="mt-2 text-sm text-muted">
                {[order.user.addressLine1, order.user.city, order.user.postcode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
          </AdminCard>

          <AdminCard className="p-5">
            <h2 className="mb-3 font-semibold">Payment</h2>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Status</dt>
                <dd>{order.payment?.status ?? '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Provider</dt>
                <dd>{stripeLinked ? 'Stripe' : isStripeConfigured() ? 'Stripe' : 'Demo mode'}</dd>
              </div>
              {order.payment?.refundedAmount ? (
                <div className="flex justify-between">
                  <dt className="text-muted">Refunded</dt>
                  <dd>{formatMoney(order.payment.refundedAmount)}</dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-4 flex flex-col gap-2">
              {order.status === 'PENDING' && (
                <>
                  <form action={markOrderPaidAction.bind(null, order.id)}>
                    <ConfirmSubmit
                      confirm="Mark this order as paid and allocate tickets?"
                      className="btn-primary w-full py-2 text-sm"
                    >
                      Mark as paid
                    </ConfirmSubmit>
                  </form>
                  <form action={cancelOrderAction.bind(null, order.id)}>
                    <ConfirmSubmit confirm="Cancel this pending order?" className="btn-ghost w-full py-2 text-sm text-red-500">
                      Cancel order
                    </ConfirmSubmit>
                  </form>
                </>
              )}
              {order.status === 'PAID' && (
                <form action={refundOrderAction.bind(null, order.id)}>
                  <ConfirmSubmit
                    confirm="Refund this order? Allocated tickets will be cancelled."
                    className="btn-secondary w-full py-2 text-sm"
                  >
                    Refund order
                  </ConfirmSubmit>
                </form>
              )}
              <a
                href={`/api/orders/${order.id}/invoice`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full py-2 text-center text-sm"
              >
                View invoice
              </a>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
