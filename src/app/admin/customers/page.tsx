import { prisma } from '@/lib/prisma';
import { formatMoney, formatDate } from '@/lib/utils';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      _count: { select: { orders: true, entries: true } },
      orders: { where: { status: 'PAID' }, select: { total: true } },
    },
  });

  return (
    <div>
      <AdminPageHeader title="Customers" description="Registered users (latest 100)." />
      <AdminCard>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-ink/50">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Orders</th>
                <th className="p-4 font-medium">Entries</th>
                <th className="p-4 font-medium">Spent</th>
                <th className="p-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const spent = c.orders.reduce((s, o) => s + o.total, 0);
                return (
                  <tr key={c.id} className="border-b border-black/5 last:border-0">
                    <td className="p-4 font-medium">{c.name ?? '—'}</td>
                    <td className="p-4 text-ink/70">{c.email}</td>
                    <td className="p-4">
                      <Badge tone={c.role === 'ADMIN' ? 'brand' : 'slate'}>{c.role}</Badge>
                    </td>
                    <td className="p-4">{c._count.orders}</td>
                    <td className="p-4">{c._count.entries}</td>
                    <td className="p-4 font-semibold">{formatMoney(spent)}</td>
                    <td className="p-4 text-ink/60">{formatDate(c.createdAt)}</td>
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
