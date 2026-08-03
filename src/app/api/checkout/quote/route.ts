import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { quotePrice, resolveCoupon } from '@/lib/orders';

export const dynamic = 'force-dynamic';

/**
 * Returns a server-computed price quote for a competition + quantity, applying
 * a coupon if valid. Used by the entry form for live discount preview. The
 * browser never sets the price — it is always looked up here.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const competitionId = body?.competitionId as string | undefined;
  const quantity = Math.max(1, Math.min(1000, Number(body?.quantity) || 1));
  const couponCode = body?.couponCode as string | undefined;

  if (!competitionId) {
    return NextResponse.json({ error: 'Missing competitionId' }, { status: 400 });
  }

  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    select: { ticketPrice: true },
  });
  if (!comp) {
    return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
  }

  const coupon = await resolveCoupon(couponCode);
  const quote = quotePrice(comp.ticketPrice, quantity, coupon);

  let couponMessage: string | null = null;
  let couponApplied = false;
  if (couponCode) {
    if (!coupon) couponMessage = 'That code is not valid.';
    else if (quote.discount === 0)
      couponMessage = coupon.minSpend
        ? 'Add more entries to meet the minimum spend for this code.'
        : 'This code could not be applied.';
    else {
      couponApplied = true;
      couponMessage = `Code applied — you saved on this order.`;
    }
  }

  return NextResponse.json({ ...quote, couponApplied, couponMessage });
}
