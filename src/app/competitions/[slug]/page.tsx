import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCompetitionBySlug, getRelatedCompetitions } from '@/lib/competitions';
import { getSession } from '@/lib/auth';
import { formatMoney, formatDate, soldPercent } from '@/lib/utils';
import { siteConfig } from '@/lib/site';
import { Badge } from '@/components/ui/badge';
import { Countdown } from '@/components/competition/countdown';
import { ProgressBar } from '@/components/competition/progress-bar';
import { EntryForm } from '@/components/competition/entry-form';
import { SaveButton } from '@/components/competition/save-button';
import { CompetitionGrid } from '@/components/competition/competition-grid';
import { prisma } from '@/lib/prisma';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SectionHeading } from '@/components/ui/section-heading';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const comp = await getCompetitionBySlug(params.slug);
  if (!comp) return { title: 'Competition not found' };
  return {
    title: comp.metaTitle || comp.title,
    description:
      comp.metaDescription || comp.subtitle || `Win ${comp.title} — worth ${formatMoney(comp.retailValue)}.`,
    alternates: { canonical: `/competitions/${comp.slug}` },
    openGraph: {
      title: comp.title,
      description: comp.subtitle || '',
      images: comp.heroImage ? [comp.heroImage] : [],
      type: 'website',
    },
  };
}

export default async function CompetitionDetailPage({ params }: { params: { slug: string } }) {
  const [comp, session] = await Promise.all([
    getCompetitionBySlug(params.slug),
    getSession(),
  ]);

  if (!comp || comp.status === 'DRAFT' || comp.archived || comp.isTemplate) notFound();

  const related = await getRelatedCompetitions(comp.id, comp.categoryId);
  const savedRecord = session
    ? await prisma.savedCompetition.findUnique({
        where: { userId_competitionId: { userId: session.userId, competitionId: comp.id } },
      })
    : null;
  const isOpen = comp.status === 'PUBLISHED' && comp.closingDate > new Date();
  const pct = soldPercent(comp.entriesSold, comp.maxEntries);
  const gallery = comp.images.length ? comp.images : comp.heroImage ? [comp.heroImage] : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: comp.title,
    description: comp.subtitle || comp.description.slice(0, 200),
    image: gallery,
    offers: {
      '@type': 'Offer',
      price: (comp.ticketPrice / 100).toFixed(2),
      priceCurrency: 'GBP',
      availability: isOpen ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${siteConfig.url}/competitions/${comp.slug}`,
    },
  };

  return (
    <div className="container py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[{ label: 'Competitions', href: '/competitions' }, { label: comp.title }]}
      />

      <div className="grid gap-10 lg:grid-cols-5">
        {/* Left: gallery + details */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl bg-white shadow-card">
            {gallery[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={gallery[0]} alt={comp.title} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-brand-100 text-brand-400">
                No image
              </div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.slice(0, 4).map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img}
                  alt={`${comp.title} ${i + 1}`}
                  className="aspect-square w-full rounded-xl object-cover"
                />
              ))}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-bold">About this prize</h2>
            <div className="prose-content mt-3">
              {comp.description.split('\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {comp.terms && (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Terms &amp; conditions</h2>
              <div className="prose-content mt-3 text-sm">
                {comp.terms.split('\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: entry panel */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-28 space-y-4">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                {comp.featured && <Badge tone="brand">Featured</Badge>}
                {comp.category && <Badge tone="slate">{comp.category.name}</Badge>}
                {pct >= 85 && isOpen && <Badge tone="amber">Almost gone</Badge>}
              </div>
              <h1 className="font-display text-3xl font-bold leading-tight">{comp.title}</h1>
              {comp.subtitle && <p className="mt-2 text-lg text-ink/70">{comp.subtitle}</p>}
              <div className="mt-3">
                <SaveButton
                  competitionId={comp.id}
                  initialSaved={Boolean(savedRecord)}
                  isAuthenticated={Boolean(session)}
                />
              </div>
            </div>

            <div className="card space-y-4 p-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-ink/50">Prize value</p>
                  <p className="text-lg font-bold text-ink">{formatMoney(comp.retailValue)}</p>
                </div>
                <div>
                  <p className="text-ink/50">Entry from</p>
                  <p className="text-lg font-bold text-brand-600">{formatMoney(comp.ticketPrice)}</p>
                </div>
              </div>

              <ProgressBar entriesSold={comp.entriesSold} maxEntries={comp.maxEntries} />

              <div className="flex items-center justify-between rounded-xl bg-cream p-3 text-sm">
                <span className="text-ink/60">{isOpen ? 'Closes in' : 'Draw'}</span>
                {isOpen ? (
                  <Countdown to={comp.closingDate} />
                ) : (
                  <span className="font-semibold">{formatDate(comp.drawDate)}</span>
                )}
              </div>

              <dl className="grid grid-cols-2 gap-2 text-xs text-ink/60">
                <div>
                  <dt className="inline">Draw date: </dt>
                  <dd className="inline font-medium text-ink/80">{formatDate(comp.drawDate)}</dd>
                </div>
                <div>
                  <dt className="inline">Max entries: </dt>
                  <dd className="inline font-medium text-ink/80">
                    {comp.maxEntries.toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>

            <EntryForm
              competitionId={comp.id}
              ticketPrice={comp.ticketPrice}
              maxEntries={comp.maxEntries}
              entriesSold={comp.entriesSold}
              maxPerUser={comp.maxPerUser}
              skillQuestion={comp.skillQuestion}
              answerOptions={comp.answerOptions}
              isAuthenticated={Boolean(session)}
              isOpen={isOpen}
            />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <SectionHeading title="You might also like" />
          <CompetitionGrid competitions={related} />
        </div>
      )}
    </div>
  );
}
