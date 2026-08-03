import type { Metadata } from 'next';
import { getPage } from '@/lib/content';
import { Markdown } from '@/components/markdown';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface Fallback {
  title: string;
  content: string;
  metaDescription?: string;
}

/** Build page metadata from the CMS Page, falling back to provided defaults. */
export async function cmsMetadata(slug: string, fallback: Fallback): Promise<Metadata> {
  const page = await getPage(slug);
  return {
    title: page?.metaTitle || page?.title || fallback.title,
    description: page?.metaDescription || fallback.metaDescription,
    alternates: { canonical: `/${slug}` },
  };
}

/** Render a CMS-managed content page, falling back to seeded defaults. */
export async function CmsContentPage({
  slug,
  fallback,
  updated = 'August 2026',
}: {
  slug: string;
  fallback: Fallback;
  updated?: string;
}) {
  const page = await getPage(slug);
  const title = page?.title || fallback.title;
  const content = page?.content || fallback.content;

  return (
    <div className="container-tight py-8">
      <Breadcrumbs items={[{ label: title }]} />
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: {updated}</p>
      <div className="mt-8">
        <Markdown content={content} />
      </div>
    </div>
  );
}
