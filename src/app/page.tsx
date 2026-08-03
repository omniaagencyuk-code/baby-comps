import { Hero } from '@/components/home/hero';
import { HowItWorks } from '@/components/home/how-it-works';
import { TrustBadges, Reviews } from '@/components/home/trust-and-reviews';
import { WinnerShowcase } from '@/components/home/winner-showcase';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { SectionHeading } from '@/components/ui/section-heading';
import { CompetitionGrid } from '@/components/competition/competition-grid';
import {
  getFeaturedCompetitions,
  getEndingSoon,
  getNewCompetitions,
  getPublishedWinners,
} from '@/lib/competitions';
import { getSettings } from '@/lib/settings';
import { getLatestPosts } from '@/lib/blog';
import { BlogCardRow } from '@/components/blog/blog-card';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featured, endingSoon, newest, winners, settings, posts] = await Promise.all([
    getFeaturedCompetitions(3),
    getEndingSoon(4),
    getNewCompetitions(3),
    getPublishedWinners(5),
    getSettings(),
    getLatestPosts(3),
  ]);

  const stats = {
    entries: settings['trust.entriesToDate'] || '120,000+',
    prizes: settings['trust.prizesGiven'] || '£400,000+',
    rating: settings['trust.rating'] || '4.9',
  };

  return (
    <>
      <Hero stats={stats} />
      <TrustBadges />

      <section className="py-16">
        <div className="container">
          <SectionHeading
            eyebrow="Hand-picked"
            title="Featured competitions"
            description="Our most popular prizes, ending soon."
            action={{ label: 'View all', href: '/competitions' }}
          />
          <CompetitionGrid competitions={featured} />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <SectionHeading
            eyebrow="Hurry!"
            title="Ending soon"
            description="Last chance to enter these draws."
            action={{ label: 'See more', href: '/competitions?sort=ending' }}
          />
          <CompetitionGrid competitions={endingSoon.slice(0, 3)} />
        </div>
      </section>

      <HowItWorks />

      <WinnerShowcase winners={winners} />

      <section className="py-16">
        <div className="container">
          <SectionHeading
            eyebrow="Fresh"
            title="New competitions"
            description="Just launched — get in early."
            action={{ label: 'View all', href: '/competitions?sort=new' }}
          />
          <CompetitionGrid competitions={newest} />
        </div>
      </section>

      <Reviews />

      {posts.length > 0 && (
        <section className="bg-white py-16">
          <div className="container">
            <SectionHeading
              eyebrow="From the blog"
              title="Guides & family tips"
              action={{ label: 'Read the blog', href: '/blog' }}
            />
            <BlogCardRow posts={posts} />
          </div>
        </section>
      )}

      <NewsletterSignup />
    </>
  );
}
