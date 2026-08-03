import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'The terms and conditions for entering Tiny Treasure Competitions.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="August 2026">
      <p>
        These terms govern your use of Tiny Treasure Competitions. By entering any competition you
        agree to these terms in full. Please read them carefully.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        Entrants must be 18 years or over and resident in the United Kingdom. Employees of Tiny
        Treasure Competitions and their immediate families may not enter.
      </p>

      <h2>2. How to enter</h2>
      <p>
        Each competition requires the correct answer to a skill-based question. Paid entries are made
        through our secure Stripe checkout. Ticket numbers are allocated automatically once payment is
        confirmed.
      </p>

      <h2>3. Free postal entry route</h2>
      <p>
        No purchase is necessary. You may enter for free by post. Send your name, address, email,
        telephone number, the competition you wish to enter and your answer to the skill question to
        our registered postal address. One entry per stamped envelope. Postal entries must be received
        before the competition closing date and are subject to the same terms as paid entries.
      </p>

      <h2>4. Closing dates and draws</h2>
      <p>
        Each competition has a published closing date and draw date. Winners are drawn from all valid
        entries using a verifiable random selection method. Where a maximum number of entries is
        stated, the competition may close early once sold out.
      </p>

      <h2>5. Winners and prizes</h2>
      <ul>
        <li>Winners are notified by email and/or telephone within 7 days of the draw.</li>
        <li>Winners are published on our Winners page (first name and region only).</li>
        <li>Physical prizes are delivered free of charge to a UK address.</li>
        <li>Where offered, a cash alternative may be taken instead of the stated prize.</li>
      </ul>

      <h2>6. Refunds and cancellations</h2>
      <p>
        Entries are non-refundable once a competition has closed, except where a competition is
        cancelled, in which case all entrants will be refunded in full.
      </p>

      <h2>7. Liability</h2>
      <p>
        We are not liable for any loss or damage arising from your entry except where such liability
        cannot be excluded by law. Nothing in these terms affects your statutory rights.
      </p>

      <h2>8. Governing law</h2>
      <p>These terms are governed by the laws of England and Wales.</p>
    </LegalPage>
  );
}
