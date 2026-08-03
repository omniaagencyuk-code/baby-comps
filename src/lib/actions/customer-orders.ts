'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Let a customer cancel their OWN order — but only while it is still PENDING.
 * A pending order has no allocated tickets (tickets are created only on
 * confirmed payment), so cancelling it is always safe and can never leave a
 * "live" ticket that could win. Paid orders can only be voided via an admin
 * refund, which marks the tickets CANCELLED and excludes them from the draw.
 */
export async function cancelMyPendingOrderAction(orderId: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== session.userId) return;
  if (order.status !== 'PENDING') return; // never touch paid orders here

  await prisma.order.update({ where: { id: orderId }, data: { status: 'CANCELLED' } });
  revalidatePath('/account/orders');
  revalidatePath(`/account/orders/${orderId}`);
}
