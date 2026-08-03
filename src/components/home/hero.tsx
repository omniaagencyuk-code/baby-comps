import { ButtonLink } from '@/components/ui/button';

export function Hero({
  stats,
}: {
  stats: { entries: string; prizes: string; rating: string };
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-cream">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-200/40 blur-3xl" />
      <div className="container relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-600 shadow-card">
            ⭐ Rated {stats.rating}/5 by families
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Win premium <span className="text-brand-600">baby &amp; family</span> prizes
          </h1>
          <p className="mt-5 max-w-lg text-lg text-ink/70">
            Enter beautiful prize competitions for a fraction of retail value. Fair, verifiable draws
            and every winner published. Your little treasure deserves the best.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/competitions" size="lg">
              Browse competitions
            </ButtonLink>
            <ButtonLink href="/winners" variant="secondary" size="lg">
              See our winners
            </ButtonLink>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink/50">Entries to date</dt>
              <dd className="text-2xl font-bold text-brand-600">{stats.entries}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink/50">Prizes given</dt>
              <dd className="text-2xl font-bold text-brand-600">{stats.prizes}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink/50">Avg rating</dt>
              <dd className="text-2xl font-bold text-brand-600">{stats.rating}★</dd>
            </div>
          </dl>
        </div>

        <div className="relative animate-fade-up">
          <div className="aspect-square overflow-hidden rounded-3xl bg-white shadow-card-hover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80"
              alt="Happy baby with prizes"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white p-4 shadow-card-hover">
            <p className="text-xs text-ink/50">This week&apos;s winner</p>
            <p className="font-semibold">Sophie from Manchester 🎉</p>
          </div>
        </div>
      </div>
    </section>
  );
}
