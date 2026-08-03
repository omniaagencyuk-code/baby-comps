import { prisma } from './prisma';
import type { Prisma } from '@prisma/client';

const cardSelect = {
  id: true,
  slug: true,
  title: true,
  subtitle: true,
  heroImage: true,
  retailValue: true,
  ticketPrice: true,
  maxEntries: true,
  entriesSold: true,
  closingDate: true,
  drawDate: true,
  featured: true,
} satisfies Prisma.CompetitionSelect;

const liveWhere: Prisma.CompetitionWhereInput = {
  status: 'PUBLISHED',
  archived: false,
  isTemplate: false,
  closingDate: { gt: new Date() },
};

export async function getFeaturedCompetitions(take = 3) {
  return prisma.competition.findMany({
    where: { ...liveWhere, featured: true },
    orderBy: { closingDate: 'asc' },
    take,
    select: cardSelect,
  });
}

export async function getEndingSoon(take = 4) {
  return prisma.competition.findMany({
    where: liveWhere,
    orderBy: { closingDate: 'asc' },
    take,
    select: cardSelect,
  });
}

export async function getNewCompetitions(take = 4) {
  return prisma.competition.findMany({
    where: liveWhere,
    orderBy: { createdAt: 'desc' },
    take,
    select: cardSelect,
  });
}

export interface ListParams {
  sort?: 'ending' | 'new' | 'price-low' | 'price-high' | 'value';
  category?: string;
  page?: number;
  perPage?: number;
}

export async function listCompetitions({
  sort = 'ending',
  category,
  page = 1,
  perPage = 12,
}: ListParams) {
  const where: Prisma.CompetitionWhereInput = {
    ...liveWhere,
    ...(category ? { category: { slug: category } } : {}),
  };

  const orderBy: Prisma.CompetitionOrderByWithRelationInput =
    sort === 'new'
      ? { createdAt: 'desc' }
      : sort === 'price-low'
        ? { ticketPrice: 'asc' }
        : sort === 'price-high'
          ? { ticketPrice: 'desc' }
          : sort === 'value'
            ? { retailValue: 'desc' }
            : { closingDate: 'asc' };

  const [items, total] = await Promise.all([
    prisma.competition.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      select: cardSelect,
    }),
    prisma.competition.count({ where }),
  ]);

  return { items, total, pages: Math.ceil(total / perPage), page };
}

export async function getCompetitionBySlug(slug: string) {
  return prisma.competition.findUnique({
    where: { slug },
    include: { category: true, winner: true },
  });
}

export async function getRelatedCompetitions(competitionId: string, categoryId?: string | null) {
  return prisma.competition.findMany({
    where: {
      ...liveWhere,
      id: { not: competitionId },
      ...(categoryId ? { categoryId } : {}),
    },
    orderBy: { closingDate: 'asc' },
    take: 3,
    select: cardSelect,
  });
}

export async function getPublishedWinners(take?: number) {
  return prisma.winner.findMany({
    where: { published: true },
    orderBy: { drawnAt: 'desc' },
    take,
    include: { competition: { select: { slug: true, retailValue: true } } },
  });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}
