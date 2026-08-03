import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { siteConfig } from '@/lib/site';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about entering, draws, prizes and payments.',
  alternates: { canonical: '/faq' },
};

export default async function FaqPage() {
  let faqs: { id: string; question: string; answer: string; category: string }[] = [];
  try {
    faqs = await prisma.fAQ.findMany({
      where: { published: true },
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
  } catch {
    faqs = [];
  }

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, f) => {
    (acc[f.category] ||= []).push(f);
    return acc;
  }, {});

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <div className="container-tight py-8">
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <Breadcrumbs items={[{ label: 'FAQ' }]} />
      <h1 className="text-3xl font-bold">Frequently asked questions</h1>
      <p className="mt-2 text-ink/60">
        Can&apos;t find what you&apos;re looking for?{' '}
        <a href="/contact" className="font-semibold text-brand-600">
          Get in touch
        </a>
        .
      </p>

      <div className="mt-8 space-y-10">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-3 text-lg font-semibold text-brand-600">{category}</h2>
            <div className="space-y-3">
              {items.map((f) => (
                <details key={f.id} className="card group p-5">
                  <summary className="flex cursor-pointer items-center justify-between font-medium">
                    {f.question}
                    <span className="text-brand-400 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-ink/70">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
        {faqs.length === 0 && (
          <p className="text-ink/50">
            FAQs are being prepared. Meanwhile, email us at {siteConfig.contactEmail}.
          </p>
        )}
      </div>
    </div>
  );
}
