import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { Badge } from '@/components/ui/badge';
import { ConfirmSubmit } from '@/components/admin/confirm-submit';
import { deleteBlogPostAction } from '@/lib/actions/admin';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description="Write and manage blog posts."
        action={
          <Link href="/admin/blog/new" className="btn-primary px-4 py-2 text-sm">
            + New post
          </Link>
        }
      />
      <AdminCard>
        <div className="divide-y divide-black/5">
          {posts.length === 0 && <p className="p-8 text-center text-ink/50">No posts yet.</p>}
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-ink/50">
                  {p.publishedAt ? formatDate(p.publishedAt) : 'Not published'} · /{p.slug}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge tone={p.published ? 'green' : 'slate'}>
                  {p.published ? 'Published' : 'Draft'}
                </Badge>
                <Link href={`/admin/blog/${p.id}`} className="text-sm font-medium text-brand-600 hover:underline">
                  Edit
                </Link>
                <form action={deleteBlogPostAction.bind(null, p.id)}>
                  <ConfirmSubmit confirm={`Delete "${p.title}"?`} className="text-sm font-medium text-red-500 hover:underline">
                    Delete
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
