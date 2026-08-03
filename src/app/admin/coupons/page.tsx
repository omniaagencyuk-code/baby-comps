import { prisma } from '@/lib/prisma';
import { formatMoney, formatDate } from '@/lib/utils';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { Badge } from '@/components/ui/badge';
import { CouponForm } from '@/components/admin/coupon-form';
import { ConfirmSubmit } from '@/components/admin/confirm-submit';
import { toggleCouponAction, deleteCouponAction } from '@/lib/actions/admin';

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Coupons" description="Create and manage discount codes." />
      <CouponForm />
      <AdminCard>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-ink/50">
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Discount</th>
                <th className="p-4 font-medium">Min spend</th>
                <th className="p-4 font-medium">Used</th>
                <th className="p-4 font-medium">Expires</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-ink/50">No coupons yet.</td></tr>
              )}
              {coupons.map((c) => {
                const expired = c.expiresAt ? c.expiresAt < new Date() : false;
                return (
                <tr key={c.id} className="border-b border-black/5 last:border-0">
                  <td className="p-4 font-mono font-semibold">{c.code}</td>
                  <td className="p-4">
                    {c.type === 'PERCENT' ? `${c.value}%` : formatMoney(c.value)}
                  </td>
                  <td className="p-4 text-ink/60">{c.minSpend ? formatMoney(c.minSpend) : '—'}</td>
                  <td className="p-4 text-ink/60">
                    {c.timesRedeemed}
                    {c.maxRedemptions ? ` / ${c.maxRedemptions}` : ''}
                  </td>
                  <td className="p-4 text-ink/60">{c.expiresAt ? formatDate(c.expiresAt) : '—'}</td>
                  <td className="p-4">
                    <Badge tone={expired ? 'red' : c.active ? 'green' : 'slate'}>
                      {expired ? 'Expired' : c.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3 text-sm">
                      <form action={toggleCouponAction.bind(null, c.id, !c.active)}>
                        <ConfirmSubmit className={c.active ? 'text-amber-600' : 'text-emerald-600'}>
                          {c.active ? 'Disable' : 'Enable'}
                        </ConfirmSubmit>
                      </form>
                      <form action={deleteCouponAction.bind(null, c.id)}>
                        <ConfirmSubmit confirm={`Delete coupon ${c.code}?`} className="text-red-500">
                          Delete
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
