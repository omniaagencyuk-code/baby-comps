const badges = [
  { icon: '🔒', title: 'Secure payments', text: 'Powered by Stripe' },
  { icon: '✅', title: 'Verifiable draws', text: 'Fair & transparent' },
  { icon: '🚚', title: 'Free UK delivery', text: 'On all physical prizes' },
  { icon: '🇬🇧', title: 'UK based', text: 'Real family business' },
];

const reviews = [
  {
    name: 'Hannah T.',
    text: 'Won a full nursery set for my second baby. The whole process was so easy and the delivery was quick!',
    rating: 5,
  },
  {
    name: 'Priya K.',
    text: 'Love that they publish every winner. Feels genuinely trustworthy compared to other sites.',
    rating: 5,
  },
  {
    name: 'James & Leah',
    text: 'Cheaper than buying a travel system outright and we actually won one. Over the moon!',
    rating: 5,
  },
];

export function TrustBadges() {
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

export function Reviews() {
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
            <figure key={r.name} className="card p-6">
              <div className="mb-3 text-amber-400" aria-label={`${r.rating} out of 5 stars`}>
                {'★'.repeat(r.rating)}
              </div>
              <blockquote className="text-ink/80">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold">— {r.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
