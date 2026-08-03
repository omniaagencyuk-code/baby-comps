import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/utils';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { Badge } from '@/components/ui/badge';
import { CouponForm } from '@/components/admin/coupon-form';

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
                <th className="p-4 font-medium">Used</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-ink/50">No coupons yet.</td></tr>
              )}
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-black/5 last:border-0">
                  <td className="p-4 font-mono font-semibold">{c.code}</td>
                  <td className="p-4">
                    {c.type === 'PERCENT' ? `${c.value}%` : formatMoney(c.value)}
                  </td>
                  <td className="p-4 text-ink/60">
                    {c.timesRedeemed}
                    {c.maxRedemptions ? ` / ${c.maxRedemptions}` : ''}
                  </td>
                  <td className="p-4">
                    <Badge tone={c.active ? 'green' : 'slate'}>{c.active ? 'Active' : 'Inactive'}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
