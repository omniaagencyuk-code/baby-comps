import type { IconItem } from '@/lib/content';

export interface ReviewItem {
  id: string;
  name: string;
  location?: string | null;
  quote: string;
  rating: number;
}

export function TrustBadges({ badges }: { badges: IconItem[] }) {
  return (
    <section className="border-y border-black/5 bg-white py-8">
      <div className="container grid grid-cols-2 gap-6 sm:grid-cols-4">
        {badges.map((b) => (
          <div key={b.title} className="flex items-center gap-3">
            <span className="text-3xl">{b.icon}</span>
            <div>
              <p className="text-sm font-semibold">{b.title}</p>
              <p className="text-xs text-ink/60">{b.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Reviews({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) return null;
  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-600">
            Loved by families
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">What our winners say</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.id} className="card p-6">
              <div className="mb-3 text-amber-400" aria-label={`${r.rating} out of 5 stars`}>
                {'★'.repeat(Math.max(0, Math.min(5, r.rating)))}
              </div>
              <blockquote className="text-ink/80">“{r.quote}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold">
                — {r.name}
                {r.location ? `, ${r.location}` : ''}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
