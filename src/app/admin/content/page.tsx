import { prisma } from '@/lib/prisma';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { HeroForm, IconBlockForm, ReviewCreateForm } from '@/components/admin/content-forms';
import { ConfirmSubmit } from '@/components/admin/confirm-submit';
import {
  getBlock,
  getIconItems,
  DEFAULT_HERO,
  DEFAULT_TRUST,
  DEFAULT_STEPS,
  type HeroContent,
} from '@/lib/content';
import {
  updateIconBlockAction,
  toggleReviewAction,
  deleteReviewAction,
} from '@/lib/actions/admin';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  const [hero, trust, steps, reviews] = await Promise.all([
    getBlock<HeroContent>('home.hero', DEFAULT_HERO),
    getIconItems('home.trustBadges', DEFAULT_TRUST),
    getIconItems('home.howItWorks', DEFAULT_STEPS),
    prisma.review.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] }),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Homepage content"
        description="Edit the hero, trust badges, how-it-works steps and reviews shown on the homepage."
      />

      <HeroForm hero={hero} />

      <IconBlockForm
        action={updateIconBlockAction.bind(null, 'home.trustBadges', 'Trust badges')}
        title="Trust badges"
        hint="One per line, formatted as: icon | title | text"
        items={trust}
      />

      <IconBlockForm
        action={updateIconBlockAction.bind(null, 'home.howItWorks', 'How it works steps')}
        title="How it works"
        hint="One per line, formatted as: icon | title | text"
        items={steps}
      />

      <section>
        <h2 className="mb-3 font-semibold">Reviews</h2>
        <ReviewCreateForm />
        <div className="mt-4 space-y-2">
          {reviews.length === 0 && (
            <AdminCard className="p-5 text-sm text-ink/50">No reviews yet.</AdminCard>
          )}
          {reviews.map((r) => (
            <AdminCard key={r.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="text-sm">
                  <span className="text-amber-400">{'★'.repeat(r.rating)}</span>{' '}
                  <span className="font-medium">{r.name}</span>
                  {r.location ? <span className="text-ink/50"> · {r.location}</span> : null}
                </p>
                <p className="truncate text-sm text-ink/60">“{r.quote}”</p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-sm">
                <form action={toggleReviewAction.bind(null, r.id, !r.published)}>
                  <ConfirmSubmit className={r.published ? 'text-amber-600' : 'text-emerald-600'}>
                    {r.published ? 'Unpublish' : 'Publish'}
                  </ConfirmSubmit>
                </form>
                <form action={deleteReviewAction.bind(null, r.id)}>
                  <ConfirmSubmit confirm="Delete this review?" className="text-red-500">
                    Delete
                  </ConfirmSubmit>
                </form>
              </div>
            </AdminCard>
          ))}
        </div>
      </section>
    </div>
  );
}
