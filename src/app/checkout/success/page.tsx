import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { fulfillOrder } from '@/lib/orders';
import { formatMoney } from '@/lib/utils';
import { ButtonLink } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const session = await getSession();
  if (!session) redirect('/login');

  const orderId = searchParams.order;
  if (!orderId) notFound();

  let order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, entries: { orderBy: { ticketNumber: 'asc' } } },
  });

  if (!order || order.userId !== session.userId) notFound();

  // Belt-and-braces: if the webhook hasn't landed yet but this is the buyer
  // returning from Stripe, attempt fulfilment now (idempotent).
  if (order.status === 'PENDING') {
    await fulfillOrder(order.id).catch(() => null);
    order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, entries: { orderBy: { ticketNumber: 'asc' } } },
    });
  }

  if (!order) notFound();

  const ticketNumbers = order.entries.map((e) => e.ticketNumber);

  return (
    <div className="container-tight py-12">
      <div className="card mx-auto max-w-xl p-8 text-center">
        <div className="text-5xl">🎉</div>
        <h1 className="mt-4 text-3xl font-bold">You&apos;re in the draw!</h1>
        <p className="mt-2 text-ink/60">
          Thank you — your entries are confirmed. Good luck!
        </p>

        <div className="mt-6 rounded-2xl bg-cream p-5 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-ink/60">Order</span>
            <span className="font-mono font-medium">{order.orderNumber}</span>
          </div>
          {order.items.map((item) => (
            <div key={item.id} className="mt-2 flex justify-between text-sm">
              <span>
                {item.quantity} × {item.competitionTitle}
              </span>
              <span className="font-medium">{formatMoney(item.lineTotal)}</span>
            </div>
          ))}
          <div className="mt-3 flex justify-between border-t border-black/10 pt-3 font-semibold">
            <span>Total paid</span>
            <span>{formatMoney(order.total)}</span>
          </div>
        </div>

        {ticketNumbers.length > 0 && (
          <div className="mt-6 text-left">
            <p className="mb-2 text-sm font-semibold">Your ticket numbers</p>
            <div className="flex flex-wrap gap-2">
              {ticketNumbers.map((n) => (
                <span
                  key={n}
                  className="rounded-lg bg-brand-100 px-2.5 py-1 font-mono text-sm font-semibold text-brand-700"
                >
                  #{n}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/account/entries">View my entries</ButtonLink>
          <ButtonLink href="/competitions" variant="secondary">
            Enter more
          </ButtonLink>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-ink/50">
        A confirmation and invoice are available in{' '}
        <Link href="/account/orders" className="font-semibold text-brand-600">
          your orders
        </Link>
        .
      </p>
    </div>
  );
}
