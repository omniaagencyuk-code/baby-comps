import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export interface BlogCardData {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  author: string;
  publishedAt: Date | null;
  category?: { name: string } | null;
}

export function BlogCard({ post }: { post: BlogCardData }) {
  return (
    <article className="card group flex flex-col overflow-hidden">
      <Link href={`/blog/${post.slug}`} className="block aspect-[16/9] overflow-hidden">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-100 text-brand-400">
            Tiny Treasure
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {post.category && (
          <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-600">
            {post.category.name}
          </span>
        )}
        <h3 className="mb-2 font-display text-lg font-semibold leading-snug">
          <Link href={`/blog/${post.slug}`} className="hover:text-brand-600">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mb-4 line-clamp-2 text-sm text-ink/60">{post.excerpt}</p>}
        <p className="mt-auto text-xs text-ink/50">
          {post.author}
          {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ''}
        </p>
      </div>
    </article>
  );
}

export function BlogCardRow({ posts }: { posts: BlogCardData[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {posts.map((p) => (
        <BlogCard key={p.slug} post={p} />
      ))}
    </div>
  );
}
