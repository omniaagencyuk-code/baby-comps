import { prisma } from './prisma';

export async function getLatestPosts(take = 6) {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take,
    include: { category: { select: { name: true, slug: true } } },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, published: true },
    include: { category: true },
  });
}

export async function getAllPostSlugs() {
  return prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });
}
