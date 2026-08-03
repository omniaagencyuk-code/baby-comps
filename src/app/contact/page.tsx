import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Tiny Treasure Competitions team.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="container-tight py-8">
      <Breadcrumbs items={[{ label: 'Contact' }]} />
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold">Get in touch</h1>
          <p className="mt-2 text-ink/60">
            Questions about a competition, an order or a prize? We&apos;re here to help.
          </p>
          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="font-semibold">Email</dt>
              <dd className="text-ink/70">{siteConfig.contactEmail}</dd>
            </div>
            <div>
              <dt className="font-semibold">Response time</dt>
              <dd className="text-ink/70">Within 1 working day</dd>
            </div>
            <div>
              <dt className="font-semibold">Social</dt>
              <dd className="text-ink/70">@tinytreasurecomps on Instagram, Facebook &amp; TikTok</dd>
            </div>
          </dl>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
