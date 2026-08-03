import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Responsible Play',
  description: 'Our commitment to keeping competitions fun, fair and within your means.',
  alternates: { canonical: '/responsible-play' },
};

export default function ResponsiblePlayPage() {
  return (
    <LegalPage title="Responsible Play" updated="August 2026">
      <p>
        Competitions should always be fun. We are committed to promoting responsible play and
        supporting anyone who may need help.
      </p>

      <h2>Our commitments</h2>
      <ul>
        <li>We only allow entrants aged 18 and over.</li>
        <li>We display clear pricing and odds (maximum entries) on every competition.</li>
        <li>We never encourage you to spend more than you can afford.</li>
      </ul>

      <h2>Tips for staying in control</h2>
      <ul>
        <li>Set yourself a budget and stick to it.</li>
        <li>Treat entry fees as the cost of entertainment, not an investment.</li>
        <li>Take a break if it stops being fun.</li>
      </ul>

      <h2>Getting support</h2>
      <p>
        If you are worried about your play, free and confidential help is available from
        BeGambleAware (begambleaware.org) and GamCare (gamcare.org.uk), or call the National Gambling
        Helpline on 0808 8020 133.
      </p>
    </LegalPage>
  );
}
