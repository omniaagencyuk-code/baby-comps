import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Tiny Treasure Competitions collects, uses and protects your personal data.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="August 2026">
      <p>
        This policy explains how we collect, use and protect your personal data in accordance with the
        UK GDPR and the Data Protection Act 2018.
      </p>

      <h2>Data we collect</h2>
      <ul>
        <li>Account details: name, email address, password (stored securely hashed).</li>
        <li>Order details: entries, ticket numbers, payment records.</li>
        <li>Contact details for prize delivery and invoicing.</li>
        <li>Technical data such as IP address and device information.</li>
      </ul>

      <h2>How we use your data</h2>
      <ul>
        <li>To administer competitions, allocate entries and contact winners.</li>
        <li>To process payments securely via Stripe.</li>
        <li>To send marketing emails where you have opted in (you can opt out anytime).</li>
        <li>To comply with our legal obligations.</li>
      </ul>

      <h2>Payment data</h2>
      <p>
        Card payments are processed by Stripe. We never store your full card details on our servers.
      </p>

      <h2>Your rights</h2>
      <p>
        You have the right to access, correct, or erase your personal data, and to withdraw consent to
        marketing at any time. Contact us to exercise these rights.
      </p>

      <h2>Cookies</h2>
      <p>
        We use essential cookies to keep you signed in and to secure checkout. Analytics cookies are
        only used with your consent.
      </p>
    </LegalPage>
  );
}
