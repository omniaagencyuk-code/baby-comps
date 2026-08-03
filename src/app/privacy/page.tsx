import type { Metadata } from 'next';
import { CmsContentPage, cmsMetadata } from '@/components/cms-content-page';

export const dynamic = 'force-dynamic';

const FALLBACK = {
  title: 'Privacy Policy',
  metaDescription:
    'How Tiny Treasure Competitions collects, uses and protects your personal data.',
  content: `This policy explains how we collect, use and protect your personal data in accordance with the UK GDPR and the Data Protection Act 2018.

## Data we collect

Account details, order details, contact details for prize delivery, and technical data such as IP address.

## Payment data

Card payments are processed by Stripe. We never store your full card details on our servers.

## Your rights

You have the right to access, correct, or erase your personal data, and to withdraw consent to marketing at any time.`,
};

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('privacy', FALLBACK);
}

export default function PrivacyPage() {
  return <CmsContentPage slug="privacy" fallback={FALLBACK} />;
}
