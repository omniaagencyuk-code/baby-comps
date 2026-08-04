import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/competitions',
    '/winners',
    '/blog',
    '/guides',
    '/faq',
    '/free-entry',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/responsible-play',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/competitions' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));

  try {
    const [comps, posts] = await Promise.all([
      prisma.competition.findMany({
        where: { status: { in: ['PUBLISHED', 'DRAWN'] } },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const compRoutes: MetadataRoute.Sitemap = comps.map((c) => ({
      url: `${base}/competitions/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'daily',
      priority: 0.9,
    }));

    const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return [...staticRoutes, ...compRoutes, ...postRoutes];
  } catch {
    return staticRoutes;
  }
}
