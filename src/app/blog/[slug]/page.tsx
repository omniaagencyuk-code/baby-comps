import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import { siteConfig } from '@/lib/site';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: siteConfig.name },
  };

  return (
    <article className="container-tight py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />

      {post.category && (
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          {post.category.name}
        </span>
      )}
      <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-ink/50">
        By {post.author}
        {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ''}
      </p>

      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.title}
          className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover"
        />
      )}

      <div className="prose-content mt-8 text-lg">
        {post.content.split('\n').map((para, i) =>
          para.trim() ? <p key={i}>{para}</p> : <br key={i} />,
        )}
      </div>
    </article>
  );
}
