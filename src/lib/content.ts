import { prisma } from './prisma';

// ---- Typed shapes for homepage content blocks --------------------

export interface HeroContent {
  badge: string;
  titleLead: string;
  titleHighlight: string;
  titleTail: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  image: string;
  winnerCaption: string;
}

export interface IconItem {
  icon: string;
  title: string;
  text: string;
}

export const DEFAULT_HERO: HeroContent = {
  badge: '⭐ Rated {rating}/5 by families',
  titleLead: 'Win premium',
  titleHighlight: 'baby & family',
  titleTail: 'prizes',
  subtitle:
    'Enter beautiful prize competitions for a fraction of retail value. Fair, verifiable draws and every winner published.',
  primaryCtaLabel: 'Browse competitions',
  primaryCtaHref: '/competitions',
  secondaryCtaLabel: 'See our winners',
  secondaryCtaHref: '/winners',
  image:
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80',
  winnerCaption: 'A happy winner every week 🎉',
};

export const DEFAULT_TRUST: IconItem[] = [
  { icon: '🔒', title: 'Secure payments', text: 'Powered by Stripe' },
  { icon: '✅', title: 'Verifiable draws', text: 'Fair & transparent' },
  { icon: '🚚', title: 'Free UK delivery', text: 'On all physical prizes' },
  { icon: '🇬🇧', title: 'UK based', text: 'Real family business' },
];

export const DEFAULT_STEPS: IconItem[] = [
  { icon: '🎁', title: 'Pick a prize', text: 'Browse our premium competitions and choose your favourite.' },
  { icon: '🧠', title: 'Answer & enter', text: 'Answer a simple skill question and choose how many entries.' },
  { icon: '💳', title: 'Pay securely', text: 'Checkout safely with Stripe. Tickets allocated instantly.' },
  { icon: '🏆', title: 'Watch the draw', text: 'We draw on the published date and publish the winner.' },
];

/** Read a content block's data with a typed fallback. */
export async function getBlock<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await prisma.contentBlock.findUnique({ where: { key } });
    if (!row) return fallback;
    return row.data as T;
  } catch {
    return fallback;
  }
}

export async function getIconItems(key: string, fallback: IconItem[]): Promise<IconItem[]> {
  const data = await getBlock<{ items?: IconItem[] }>(key, { items: fallback });
  return Array.isArray(data.items) && data.items.length ? data.items : fallback;
}

export async function getPublishedReviews(take = 6) {
  try {
    return await prisma.review.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      take,
    });
  } catch {
    return [];
  }
}

export async function getPage(slug: string) {
  try {
    return await prisma.page.findFirst({ where: { slug, published: true } });
  } catch {
    return null;
  }
}
