'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { fulfillOrder } from '@/lib/orders';

export interface OrderActionState {
  error?: string;
  success?: string;
}

async function logAudit(action: string, orderId: string, meta?: unknown) {
  const session = await requireAdmin();
  await prisma.auditLog.create({
    data: { action, entity: 'Order', entityId: orderId, meta: meta as never, userId: session.userId },
  });
}

/**
 * Refund a paid order. If Stripe is configured and the order has a payment
 * intent, a real refund is issued; the webhook then flips the order/entries to
 * refunded. Otherwise (demo mode) we mark it refunded and cancel entries here.
 */
export async function refundOrderAction(orderId: string): Promise<void> {
  await requireAdmin();
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true },
  });
  if (!order || order.status !== 'PAID') return;

  const paymentIntentId = order.stripePaymentIntentId || order.payment?.stripePaymentIntentId;

  if (isStripeConfigured() && paymentIntentId) {
    try {
      await getStripe().refunds.create({ payment_intent: paymentIntentId });
      await logAudit('order.refund.requested', orderId);
      // The charge.refunded webhook finalises state.
      revalidatePath(`/admin/orders/${orderId}`);
      return;
    } catch {
      // Fall through to manual refund marking.
    }
  }

  // Demo / manual refund path.
  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status: 'REFUNDED' } }),
    prisma.payment.updateMany({
      where: { orderId },
      data: { status: 'REFUNDED', refundedAmount: order.total },
    }),
    prisma.entry.updateMany({ where: { orderId }, data: { status: 'CANCELLED' } }),
  ]);
  await logAudit('order.refund.manual', orderId);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath('/admin/orders');
}

/** Manually mark a PENDING order as paid (fulfils + allocates tickets). */
export async function markOrderPaidAction(orderId: string): Promise<void> {
  await requireAdmin();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.status !== 'PENDING') return;
  await fulfillOrder(orderId, { amount: order.total });
  await logAudit('order.markPaid', orderId);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath('/admin/orders');
}

/** Cancel a PENDING order (no tickets were allocated). */
export async function cancelOrderAction(orderId: string): Promise<void> {
  await requireAdmin();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.status !== 'PENDING') return;
  await prisma.order.update({ where: { id: orderId }, data: { status: 'CANCELLED' } });
  await logAudit('order.cancel', orderId);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath('/admin/orders');
}
