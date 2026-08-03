import type { Metadata } from 'next';
import { CmsContentPage, cmsMetadata } from '@/components/cms-content-page';

export const dynamic = 'force-dynamic';

const FALLBACK = {
  title: 'Terms & Conditions',
  metaDescription: 'The terms and conditions for entering Tiny Treasure Competitions.',
  content: `These terms govern your use of Tiny Treasure Competitions. By entering any competition you agree to these terms in full.

## Eligibility

Entrants must be 18 years or over and resident in the United Kingdom.

## Free postal entry route

No purchase is necessary. A free entry route is available by post — see our current postal entry address and requirements.

## Draws

Winners are drawn from all valid entries using a verifiable random method on the published draw date, and every winner is published.`,
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('terms', FALLBACK);
}

export default function TermsPage() {
  return <CmsContentPage slug="terms" fallback={FALLBACK} />;
}
