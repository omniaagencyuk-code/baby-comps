import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkoutSchema } from '@/lib/validation';
import { quotePrice, createPendingOrder, resolveCoupon, fulfillOrder } from '@/lib/orders';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { siteConfig } from '@/lib/site';
import { limitByIp } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const limit = limitByIp(req.headers, 'checkout', { limit: 20, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many attempts. Please slow down.' }, { status: 429 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Please log in to enter.' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const { competitionId, quantity, answer, couponCode } = parsed.data;

  const comp = await prisma.competition.findUnique({ where: { id: competitionId } });
  if (!comp || comp.status !== 'PUBLISHED') {
    return NextResponse.json({ error: 'This competition is not available.' }, { status: 404 });
  }
  if (comp.closingDate <= new Date()) {
    return NextResponse.json({ error: 'This competition has closed.' }, { status: 400 });
  }

  // Skill question must be answered correctly (UK compliance).
  if (comp.correctAnswer && answer !== comp.correctAnswer) {
    return NextResponse.json(
      { error: 'That is not the correct answer to the skill question.' },
      { status: 400 },
    );
  }

  // Stock check.
  const remaining = comp.maxEntries - comp.entriesSold;
  if (quantity > remaining) {
    return NextResponse.json(
      { error: `Only ${remaining} entries remaining.` },
      { status: 400 },
    );
  }

  // Per-user cap.
  if (comp.maxPerUser) {
    const existing = await prisma.entry.count({
      where: { competitionId, userId: session.userId },
    });
    if (existing + quantity > comp.maxPerUser) {
      return NextResponse.json(
        { error: `You can enter this competition a maximum of ${comp.maxPerUser} times.` },
        { status: 400 },
      );
    }
  }

  const coupon = await resolveCoupon(couponCode);
  // Price is computed server-side — the browser never sets the amount.
  const quote = quotePrice(comp.ticketPrice, quantity, coupon);

  const order = await createPendingOrder({
    userId: session.userId,
    competitionId: comp.id,
    competitionTitle: comp.title,
    quote,
    couponId: coupon?.id ?? null,
  });

  // ---- Dev fallback: no Stripe configured -------------------------
  // Fulfil immediately so the entire flow is testable end-to-end.
  if (!isStripeConfigured()) {
    await fulfillOrder(order.id, { amount: quote.total });
    return NextResponse.json({
      url: `/checkout/success?order=${order.id}&demo=1`,
      orderId: order.id,
      demo: true,
    });
  }

  // ---- Stripe Checkout --------------------------------------------
  const stripe = getStripe();
  const checkout = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: session.email,
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `${comp.title} — ${quantity} ${quantity === 1 ? 'entry' : 'entries'}`,
            description: comp.subtitle || undefined,
          },
          // Charge the discounted per-order total as a single unit.
          unit_amount: quote.total,
        },
        quantity: 1,
      },
    ],
    metadata: {
      orderId: order.id,
      competitionId: comp.id,
      userId: session.userId,
      quantity: String(quantity),
    },
    // Auto-expire the session after 60 minutes if unpaid. Stripe then fires
    // `checkout.session.expired`, which cancels the still-pending order — so
    // abandoned checkouts clean themselves up with no manual approval.
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    success_url: `${siteConfig.url}/checkout/success?order=${order.id}`,
    cancel_url: `${siteConfig.url}/competitions/${comp.slug}?cancelled=1`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: checkout.id },
  });

  return NextResponse.json({ url: checkout.url, orderId: order.id });
}
