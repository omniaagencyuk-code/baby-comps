import type { Metadata } from 'next';
import Link from 'next/link';
import { getLatestPosts } from '@/lib/blog';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Guides',
  description: 'Helpful guides for new and expecting parents, and how our competitions work.',
  alternates: { canonical: '/guides' },
};

const evergreen = [
  {
    title: 'How UK prize competitions work',
    text: 'Understand skill questions, free entry routes and how draws are run.',
    href: '/blog/how-uk-prize-competitions-work',
  },
  {
    title: 'The ultimate nursery checklist',
    text: 'Everything you actually need to set up a safe, cosy nursery.',
    href: '/blog/nursery-checklist-for-new-parents',
  },
  {
    title: 'Understanding responsible play',
    text: 'How to keep competitions fun and within your budget.',
    href: '/responsible-play',
  },
];

export default async function GuidesPage() {
  const posts = await getLatestPosts(6);
  return (
    <div className="container-tight py-8">
      <Breadcrumbs items={[{ label: 'Guides' }]} />
      <h1 className="text-3xl font-bold">Guides for families</h1>
      <p className="mt-2 text-ink/60">Practical advice and everything you need to know before you enter.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {evergreen.map((g) => (
          <Link key={g.href} href={g.href} className="card block p-6 transition hover:shadow-card-hover">
            <h2 className="font-display text-lg font-semibold">{g.title}</h2>
            <p className="mt-2 text-sm text-ink/60">{g.text}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-brand-600">Read guide →</span>
          </Link>
        ))}
      </div>

      {posts.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold">More from the blog</h2>
          <ul className="space-y-2">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="font-medium text-brand-600 hover:underline">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
