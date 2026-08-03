import { saveBlogPostAction } from '@/lib/actions/admin';
import { BlogForm } from '@/components/admin/blog-form';
import { AdminPageHeader } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default function NewBlogPostPage() {
  const action = saveBlogPostAction.bind(null, null);
  return (
    <div>
      <AdminPageHeader title="New blog post" />
      <BlogForm
        action={action}
        values={{
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          coverImage: '',
          author: 'Tiny Treasure Team',
          published: false,
        }}
      />
    </div>
  );
}
