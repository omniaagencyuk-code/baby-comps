import { prisma } from '@/lib/prisma';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { ConfirmSubmit } from '@/components/admin/confirm-submit';
import { CategoryCreateForm, CategoryEditForm } from '@/components/admin/category-forms';
import { deleteCategoryAction } from '@/lib/actions/categories';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { competitions: true, posts: true } } },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Organise competitions and blog posts into browsable categories."
      />
      <CategoryCreateForm />

      <AdminCard>
        <div className="divide-y divide-black/5">
          {categories.length === 0 && (
            <p className="p-8 text-center text-ink/50">No categories yet.</p>
          )}
          {categories.map((c) => (
            <div key={c.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-ink/50">
                    /{c.slug} · {c._count.competitions} competitions · {c._count.posts} posts
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <CategoryEditForm
                    id={c.id}
                    values={{ name: c.name, slug: c.slug, description: c.description ?? '' }}
                  />
                  <form action={deleteCategoryAction.bind(null, c.id)}>
                    <ConfirmSubmit
                      confirm={`Delete “${c.name}”? Competitions and posts will become uncategorised.`}
                      className="text-sm font-medium text-red-500 hover:underline"
                    >
                      Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
