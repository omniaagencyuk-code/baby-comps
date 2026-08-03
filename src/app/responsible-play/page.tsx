import type { Metadata } from 'next';
import { CmsContentPage, cmsMetadata } from '@/components/cms-content-page';

export const dynamic = 'force-dynamic';

const FALLBACK = {
  title: 'Responsible Play',
  metaDescription: 'Our commitment to keeping competitions fun, fair and within your means.',
  content: `Competitions should always be fun. We are committed to promoting responsible play.

## Our commitments

We only allow entrants aged 18 and over, display clear pricing and odds on every competition, and never encourage you to spend more than you can afford.

## Getting support

Free and confidential help is available from BeGambleAware (begambleaware.org) and GamCare (gamcare.org.uk), or call the National Gambling Helpline on 0808 8020 133.`,
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('responsible-play', FALLBACK);
}

export default function ResponsiblePlayPage() {
  return <CmsContentPage slug="responsible-play" fallback={FALLBACK} />;
}
