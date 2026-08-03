import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { savePageAction } from '@/lib/actions/admin';
import { PageForm } from '@/components/admin/page-form';
import { AdminPageHeader } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

const CORE = ['about', 'terms', 'privacy', 'responsible-play'];

export default async function EditPagePage({ params }: { params: { id: string } }) {
  const page = await prisma.page.findUnique({ where: { id: params.id } });
  if (!page) notFound();

  const action = savePageAction.bind(null, page.id);
  return (
    <div>
      <AdminPageHeader title={`Edit: ${page.title}`} />
      <PageForm
        action={action}
        lockSlug={CORE.includes(page.slug)}
        values={{
          title: page.title,
          slug: page.slug,
          content: page.content,
          metaTitle: page.metaTitle ?? '',
          metaDescription: page.metaDescription ?? '',
          published: page.published,
        }}
      />
    </div>
  );
}
