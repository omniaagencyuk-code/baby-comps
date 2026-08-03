import type { Metadata } from 'next';
import { getLatestPosts } from '@/lib/blog';
import { BlogCardRow } from '@/components/blog/blog-card';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog & Guides',
  description: 'Family tips, nursery guides and news from Tiny Treasure Competitions.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const posts = await getLatestPosts(30);

  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: 'Blog' }]} />
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold">The Tiny Treasure blog</h1>
        <p className="mt-2 text-ink/60">Guides, tips and stories for growing families.</p>
      </div>
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-ink/50">
          No posts published yet — check back soon!
        </div>
      ) : (
        <BlogCardRow posts={posts} />
      )}
    </div>
  );
}
