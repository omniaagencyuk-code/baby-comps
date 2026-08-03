import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { formatMoney, formatDate, soldPercent } from '@/lib/utils';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { Badge } from '@/components/ui/badge';
import { ConfirmSubmit } from '@/components/admin/confirm-submit';
import {
  deleteCompetitionAction,
  duplicateCompetitionAction,
  saveAsTemplateAction,
  setArchivedAction,
  useTemplateAction,
} from '@/lib/actions/admin';

export const dynamic = 'force-dynamic';

const statusTone = {
  DRAFT: 'slate',
  PUBLISHED: 'green',
  CLOSED: 'amber',
  DRAWN: 'brand',
} as const;

type View = 'active' | 'archived' | 'templates';

const tabs: { key: View; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'templates', label: 'Templates' },
  { key: 'archived', label: 'Archived' },
];

export default async function AdminCompetitionsPage({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  const view: View =
    searchParams.view === 'archived'
      ? 'archived'
      : searchParams.view === 'templates'
        ? 'templates'
        : 'active';

  const where: Prisma.CompetitionWhereInput =
    view === 'templates'
      ? { isTemplate: true }
      : view === 'archived'
        ? { archived: true, isTemplate: false }
        : { archived: false, isTemplate: false };

  const comps = await prisma.competition.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  const linkBtn = 'font-medium hover:underline';

  return (
    <div>
      <AdminPageHeader
        title="Competitions"
        description="Create, duplicate, template, archive and manage prize competitions."
        action={
          <Link href="/admin/competitions/new" className="btn-primary px-4 py-2 text-sm">
            + New competition
          </Link>
        }
      />

      <div className="mb-4 flex gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/admin/competitions?view=${t.key}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              view === t.key ? 'bg-ink text-white' : 'bg-white text-ink/60 hover:bg-black/5'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <AdminCard>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-ink/50">
                <th className="p-4 font-medium">Title</th>
                {view !== 'templates' && <th className="p-4 font-medium">Status</th>}
                <th className="p-4 font-medium">Price</th>
                {view !== 'templates' && <th className="p-4 font-medium">Sold</th>}
                <th className="p-4 font-medium">Closes</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {comps.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ink/50">
                    {view === 'templates'
                      ? 'No templates yet. Use “Save as template” on any competition.'
                      : view === 'archived'
                        ? 'No archived competitions.'
                        : 'No competitions yet. Create your first one!'}
                  </td>
                </tr>
              )}
              {comps.map((c) => (
                <tr key={c.id} className="border-b border-black/5 last:border-0 align-top">
                  <td className="p-4">
                    <p className="font-medium">{c.title}</p>
                    <p className="text-xs text-ink/40">{c.category?.name ?? 'Uncategorised'}</p>
                  </td>
                  {view !== 'templates' && (
                    <td className="p-4">
                      <Badge tone={statusTone[c.status]}>{c.status}</Badge>
                    </td>
                  )}
                  <td className="p-4">{formatMoney(c.ticketPrice)}</td>
                  {view !== 'templates' && (
                    <td className="p-4">
                      <span className="text-ink/70">
                        {c.entriesSold}/{c.maxEntries}
                      </span>
                      <span className="ml-1 text-xs text-ink/40">
                        ({soldPercent(c.entriesSold, c.maxEntries)}%)
                      </span>
                    </td>
                  )}
                  <td className="p-4 text-ink/60">{formatDate(c.closingDate)}</td>
                  <td className="p-4 text-right">
                    <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
                      <Link href={`/admin/competitions/${c.id}`} className={`${linkBtn} text-brand-600`}>
                        Edit
                      </Link>

                      {view === 'templates' ? (
                        <form action={useTemplateAction.bind(null, c.id)}>
                          <ConfirmSubmit className={`${linkBtn} text-emerald-600`}>
                            Use template
                          </ConfirmSubmit>
                        </form>
                      ) : (
                        <>
                          <form action={duplicateCompetitionAction.bind(null, c.id)}>
                            <ConfirmSubmit className={`${linkBtn} text-ink/60`}>Duplicate</ConfirmSubmit>
                          </form>
                          {view === 'active' ? (
                            <>
                              <form action={saveAsTemplateAction.bind(null, c.id)}>
                                <ConfirmSubmit className={`${linkBtn} text-ink/60`}>
                                  Save as template
                                </ConfirmSubmit>
                              </form>
                              <form action={setArchivedAction.bind(null, c.id, true)}>
                                <ConfirmSubmit className={`${linkBtn} text-amber-600`}>
                                  Archive
                                </ConfirmSubmit>
                              </form>
                            </>
                          ) : (
                            <form action={setArchivedAction.bind(null, c.id, false)}>
                              <ConfirmSubmit className={`${linkBtn} text-emerald-600`}>
                                Restore
                              </ConfirmSubmit>
                            </form>
                          )}
                        </>
                      )}

                      <form action={deleteCompetitionAction.bind(null, c.id)}>
                        <ConfirmSubmit
                          confirm={`Delete "${c.title}"? This cannot be undone.`}
                          className={`${linkBtn} text-red-500`}
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
