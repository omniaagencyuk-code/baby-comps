import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney, formatDate } from '@/lib/utils';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';

/**
 * Returns a printable HTML invoice for an order. The browser's "Save as PDF"
 * turns this into a downloadable document without a heavyweight PDF dependency.
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, user: true, coupon: true },
  });

  if (!order || order.userId !== session.userId) {
    return new Response('Not found', { status: 404 });
  }

  const rows = order.items
    .map(
      (i) => `<tr>
        <td>${i.competitionTitle}</td>
        <td style="text-align:center">${i.quantity}</td>
        <td style="text-align:right">${formatMoney(i.unitPrice)}</td>
        <td style="text-align:right">${formatMoney(i.lineTotal)}</td>
      </tr>`,
    )
    .join('');

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Invoice ${order.orderNumber}</title>
<style>
  * { font-family: -apple-system, Segoe UI, Roboto, sans-serif; color: #3a302b; }
  body { max-width: 720px; margin: 40px auto; padding: 0 24px; }
  h1 { color: #916c58; margin: 0; }
  .muted { color: #6e5e52; font-size: 14px; }
  table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  th, td { padding: 8px 4px; border-bottom: 1px solid #eee; font-size: 14px; }
  th { text-align: left; color: #6e5e52; }
  .totals td { border: none; }
  .print-btn { margin-top: 24px; padding: 10px 18px; background: #916c58; color: #fff;
    border: none; border-radius: 999px; font-weight: 600; cursor: pointer; }
  @media print { .print-btn { display: none; } }
</style>
</head>
<body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start">
    <div>
      <h1>🧸 ${siteConfig.name}</h1>
      <p class="muted">${siteConfig.contactEmail}</p>
    </div>
    <div style="text-align:right">
      <strong>INVOICE</strong>
      <p class="muted">${order.orderNumber}<br/>${formatDate(order.createdAt)}</p>
    </div>
  </div>

  <p class="muted">Billed to: <strong>${order.user.name ?? order.user.email}</strong><br/>${order.user.email}</p>

  <table>
    <thead>
      <tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit</th><th style="text-align:right">Total</th></tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot class="totals">
      <tr><td colspan="3" style="text-align:right">Subtotal</td><td style="text-align:right">${formatMoney(order.subtotal)}</td></tr>
      ${order.discount > 0 ? `<tr><td colspan="3" style="text-align:right">Discount ${order.coupon ? `(${order.coupon.code})` : ''}</td><td style="text-align:right">−${formatMoney(order.discount)}</td></tr>` : ''}
      <tr><td colspan="3" style="text-align:right"><strong>Total (${order.status})</strong></td><td style="text-align:right"><strong>${formatMoney(order.total)}</strong></td></tr>
    </tfoot>
  </table>

  <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  <p class="muted" style="margin-top:32px">Thank you for entering ${siteConfig.name}. Good luck! 🍀</p>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
