import { savePageAction } from '@/lib/actions/admin';
import { PageForm } from '@/components/admin/page-form';
import { AdminPageHeader } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default function NewPagePage() {
  const action = savePageAction.bind(null, null);
  return (
    <div>
      <AdminPageHeader title="New content page" />
      <PageForm
        action={action}
        values={{ title: '', slug: '', content: '', metaTitle: '', metaDescription: '', published: true }}
      />
    </div>
  );
}
