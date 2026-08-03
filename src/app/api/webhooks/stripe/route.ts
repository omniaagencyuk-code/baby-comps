import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { fulfillOrder } from '@/lib/orders';

// Stripe needs the raw body to verify the signature.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const stripe = getStripe();
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error('⚠️  Stripe signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        if (orderId && session.payment_status === 'paid') {
          await fulfillOrder(orderId, {
            stripePaymentIntentId:
              typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
            amount: session.amount_total ?? undefined,
          });
        }
        break;
      }

      case 'checkout.session.expired': {
        // Customer abandoned checkout. Cancel the still-pending order so it
        // doesn't linger. No tickets exist (they're only created on payment).
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        if (orderId) {
          await prisma.order.updateMany({
            where: { id: orderId, status: 'PENDING' },
            data: { status: 'CANCELLED' },
          });
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const pi = typeof charge.payment_intent === 'string' ? charge.payment_intent : undefined;
        if (pi) {
          const order = await prisma.order.findFirst({
            where: { stripePaymentIntentId: pi },
          });
          if (order) {
            await prisma.$transaction([
              prisma.order.update({ where: { id: order.id }, data: { status: 'REFUNDED' } }),
              prisma.payment.updateMany({
                where: { orderId: order.id },
                data: { status: 'REFUNDED', refundedAmount: charge.amount_refunded },
              }),
              prisma.entry.updateMany({
                where: { orderId: order.id },
                data: { status: 'CANCELLED' },
              }),
            ]);
          }
        }
        break;
      }

      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break;
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
