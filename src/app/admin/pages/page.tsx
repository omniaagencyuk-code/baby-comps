import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { Badge } from '@/components/ui/badge';
import { ConfirmSubmit } from '@/components/admin/confirm-submit';
import { deletePageAction } from '@/lib/actions/admin';

export const dynamic = 'force-dynamic';

const CORE = ['about', 'terms', 'privacy', 'responsible-play'];

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({ orderBy: { slug: 'asc' } });

  return (
    <div>
      <AdminPageHeader
        title="Content pages"
        description="Edit About, legal and any custom content pages."
        action={
          <Link href="/admin/pages/new" className="btn-primary px-4 py-2 text-sm">
            + New page
          </Link>
        }
      />
      <AdminCard>
        <div className="divide-y divide-black/5">
          {pages.length === 0 && (
            <p className="p-8 text-center text-ink/50">
              No pages yet. Seed the database or create one.
            </p>
          )}
          {pages.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">
                  {p.title}
                  {CORE.includes(p.slug) && (
                    <span className="ml-2 text-xs text-ink/40">core</span>
                  )}
                </p>
                <p className="text-xs text-ink/50">
                  /{p.slug} · updated {formatDate(p.updatedAt)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge tone={p.published ? 'green' : 'slate'}>
                  {p.published ? 'Published' : 'Draft'}
                </Badge>
                <Link
                  href={`/${p.slug}`}
                  target="_blank"
                  className="text-sm text-ink/50 hover:underline"
                >
                  View
                </Link>
                <Link href={`/admin/pages/${p.id}`} className="text-sm font-medium text-brand-600 hover:underline">
                  Edit
                </Link>
                {!CORE.includes(p.slug) && (
                  <form action={deletePageAction.bind(null, p.id)}>
                    <ConfirmSubmit confirm={`Delete "${p.title}"?`} className="text-sm font-medium text-red-500 hover:underline">
                      Delete
                    </ConfirmSubmit>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
