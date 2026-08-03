import { prisma } from './prisma';
import { generateOrderNumber } from './utils';
import type { Coupon } from '@prisma/client';

export interface PriceQuote {
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: number;
  total: number;
}

/**
 * Compute an order price entirely server-side. NEVER trust a browser-supplied
 * price — we look the ticket price up from the database.
 */
export function quotePrice(ticketPrice: number, quantity: number, coupon?: Coupon | null): PriceQuote {
  const unitPrice = ticketPrice;
  const subtotal = unitPrice * quantity;
  let discount = 0;
  if (coupon && coupon.active) {
    if (coupon.type === 'PERCENT') {
      discount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discount = Math.min(subtotal, coupon.value);
    }
  }
  const total = Math.max(0, subtotal - discount);
  return { quantity, unitPrice, subtotal, discount, total };
}

export interface CreateOrderArgs {
  userId: string;
  competitionId: string;
  competitionTitle: string;
  quote: PriceQuote;
  couponId?: string | null;
}

/** Create a PENDING order + line item. Tickets are only allocated on payment. */
export async function createPendingOrder(args: CreateOrderArgs) {
  return prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      status: 'PENDING',
      userId: args.userId,
      subtotal: args.quote.subtotal,
      discount: args.quote.discount,
      total: args.quote.total,
      couponId: args.couponId ?? null,
      items: {
        create: {
          competitionId: args.competitionId,
          competitionTitle: args.competitionTitle,
          quantity: args.quote.quantity,
          unitPrice: args.quote.unitPrice,
          lineTotal: args.quote.total,
        },
      },
    },
    include: { items: true },
  });
}

/**
 * Fulfil a paid order: allocate sequential ticket numbers, create Entry rows,
 * increment entriesSold, record the Payment, and mark the order PAID.
 *
 * Idempotent: calling it twice for the same order is a no-op after the first
 * success (guarded by order status + a check for existing entries).
 */
export async function fulfillOrder(
  orderId: string,
  payment?: {
    stripePaymentIntentId?: string;
    stripeChargeId?: string;
    receiptUrl?: string;
    amount?: number;
  },
): Promise<{ allocated: boolean; ticketNumbers: number[] }> {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true, entries: true },
    });
    if (!order) throw new Error(`Order ${orderId} not found`);

    // Idempotency guard — already fulfilled.
    if (order.status === 'PAID' || order.entries.length > 0) {
      return { allocated: false, ticketNumbers: order.entries.map((e) => e.ticketNumber) };
    }

    const ticketNumbers: number[] = [];

    for (const item of order.items) {
      const comp = await tx.competition.findUnique({ where: { id: item.competitionId } });
      if (!comp) throw new Error(`Competition ${item.competitionId} not found`);

      let next = comp.entriesSold + 1;
      for (let i = 0; i < item.quantity; i++) {
        const ticketNumber = next++;
        await tx.entry.create({
          data: {
            ticketNumber,
            status: 'CONFIRMED',
            competitionId: comp.id,
            userId: order.userId,
            orderId: order.id,
          },
        });
        ticketNumbers.push(ticketNumber);
      }

      await tx.competition.update({
        where: { id: comp.id },
        data: { entriesSold: { increment: item.quantity } },
      });
    }

    await tx.payment.upsert({
      where: { orderId: order.id },
      update: {
        status: 'SUCCEEDED',
        stripePaymentIntentId: payment?.stripePaymentIntentId,
        stripeChargeId: payment?.stripeChargeId,
        receiptUrl: payment?.receiptUrl,
      },
      create: {
        orderId: order.id,
        status: 'SUCCEEDED',
        amount: payment?.amount ?? order.total,
        stripePaymentIntentId: payment?.stripePaymentIntentId,
        stripeChargeId: payment?.stripeChargeId,
        receiptUrl: payment?.receiptUrl,
      },
    });

    if (order.couponId) {
      await tx.coupon.update({
        where: { id: order.couponId },
        data: { timesRedeemed: { increment: 1 } },
      });
    }

    await tx.order.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        stripePaymentIntentId: payment?.stripePaymentIntentId,
      },
    });

    return { allocated: true, ticketNumbers };
  });
}

/** Validate a coupon code, returning the coupon if usable. */
export async function resolveCoupon(code?: string): Promise<Coupon | null> {
  if (!code) return null;
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (!coupon || !coupon.active) return null;
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return null;
  if (coupon.maxRedemptions && coupon.timesRedeemed >= coupon.maxRedemptions) return null;
  return coupon;
}
