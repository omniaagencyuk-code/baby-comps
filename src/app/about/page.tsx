import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Tiny Treasure Competitions is a UK family business giving away premium baby and family prizes through fair, verifiable draws.',
  alternates: { canonical: '/about' },
};

const values = [
  { icon: '🤝', title: 'Trust first', text: 'Every winner is published and every draw is verifiable.' },
  { icon: '💷', title: 'Great value', text: 'Premium prizes for a fraction of their retail price.' },
  { icon: '👶', title: 'Family focused', text: 'Prizes chosen by parents, for parents.' },
];

export default function AboutPage() {
  return (
    <div className="container-tight py-8">
      <Breadcrumbs items={[{ label: 'About' }]} />
      <h1 className="text-3xl font-bold sm:text-4xl">We help families win the things they love</h1>
      <p className="mt-4 text-lg text-ink/70">
        Tiny Treasure Competitions was founded by parents who wanted a fairer, friendlier way to win
        premium baby and family prizes. We hand-pick every prize, run transparent draws, and publish
        each and every winner — because trust is everything.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="card p-6">
            <div className="mb-2 text-3xl">{v.icon}</div>
            <h2 className="font-semibold">{v.title}</h2>
            <p className="mt-1 text-sm text-ink/60">{v.text}</p>
          </div>
        ))}
      </div>

      <div className="prose-content mt-12">
        <h2 className="text-2xl font-bold">Our promise</h2>
        <p>
          We operate our competitions in line with UK law. Every paid entry includes a genuine skill
          question, and a free postal entry route is always available. Draws take place on the
          published date using a verifiable random method.
        </p>
        <h2 className="text-2xl font-bold">Play responsibly</h2>
        <p>
          Competitions should always be fun. Please only spend what you can comfortably afford. If
          you ever feel your play is becoming a problem, support is available at BeGambleAware.org.
        </p>
      </div>

      <div className="mt-10 rounded-3xl bg-brand-50 p-8 text-center">
        <h2 className="text-2xl font-bold">Ready to find your treasure?</h2>
        <p className="mt-2 text-ink/60">Browse our live competitions and enter in seconds.</p>
        <ButtonLink href="/competitions" size="lg" className="mt-5">
          View competitions
        </ButtonLink>
      </div>
    </div>
  );
}
