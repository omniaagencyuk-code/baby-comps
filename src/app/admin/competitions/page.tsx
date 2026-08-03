import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatMoney, formatDate, soldPercent } from '@/lib/utils';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { Badge } from '@/components/ui/badge';
import { ConfirmSubmit } from '@/components/admin/confirm-submit';
import { deleteCompetitionAction } from '@/lib/actions/admin';

export const dynamic = 'force-dynamic';

const statusTone = {
  DRAFT: 'slate',
  PUBLISHED: 'green',
  CLOSED: 'amber',
  DRAWN: 'brand',
} as const;

export default async function AdminCompetitionsPage() {
  const comps = await prisma.competition.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  return (
    <div>
      <AdminPageHeader
        title="Competitions"
        description="Create and manage prize competitions."
        action={
          <Link href="/admin/competitions/new" className="btn-primary px-4 py-2 text-sm">
            + New competition
          </Link>
        }
      />

      <AdminCard>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-ink/50">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Sold</th>
                <th className="p-4 font-medium">Closes</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {comps.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ink/50">
                    No competitions yet. Create your first one!
                  </td>
                </tr>
              )}
              {comps.map((c) => (
                <tr key={c.id} className="border-b border-black/5 last:border-0">
                  <td className="p-4">
                    <p className="font-medium">{c.title}</p>
                    <p className="text-xs text-ink/40">{c.category?.name ?? 'Uncategorised'}</p>
                  </td>
                  <td className="p-4">
                    <Badge tone={statusTone[c.status]}>{c.status}</Badge>
                  </td>
                  <td className="p-4">{formatMoney(c.ticketPrice)}</td>
                  <td className="p-4">
                    <span className="text-ink/70">
                      {c.entriesSold}/{c.maxEntries}
                    </span>
                    <span className="ml-1 text-xs text-ink/40">
                      ({soldPercent(c.entriesSold, c.maxEntries)}%)
                    </span>
                  </td>
                  <td className="p-4 text-ink/60">{formatDate(c.closingDate)}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/competitions/${c.id}`}
                        className="font-medium text-brand-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deleteCompetitionAction.bind(null, c.id)}>
                        <ConfirmSubmit
                          confirm={`Delete "${c.title}"? This cannot be undone.`}
                          className="font-medium text-red-500 hover:underline"
                        >
                          Delete
                        </ConfirmSubmit>
                      </form>
                    </div>
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
