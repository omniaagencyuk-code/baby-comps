import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { saveBlogPostAction } from '@/lib/actions/admin';
import { BlogForm } from '@/components/admin/blog-form';
import { AdminPageHeader } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  const action = saveBlogPostAction.bind(null, post.id);
  return (
    <div>
      <AdminPageHeader title="Edit blog post" />
      <BlogForm
        action={action}
        values={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? '',
          content: post.content,
          coverImage: post.coverImage ?? '',
          author: post.author,
          published: post.published,
        }}
      />
    </div>
  );
}
