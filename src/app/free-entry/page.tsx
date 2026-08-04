import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { siteConfig } from '@/lib/site';
import { formatDate } from '@/lib/utils';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/ui/icon';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Free Postal Entry (No Purchase Necessary)',
  description:
    'How to enter Tiny Treasure Competitions for free by post. No purchase necessary — postal entries are treated equally to paid entries.',
  alternates: { canonical: '/free-entry' },
};

export default async function FreeEntryPage() {
  const [settings, comps] = await Promise.all([
    getSettings(),
    prisma.competition
      .findMany({
        where: { status: 'PUBLISHED', archived: false, isTemplate: false, closingDate: { gt: new Date() } },
        orderBy: { closingDate: 'asc' },
        select: { slug: true, title: true, closingDate: true },
        take: 20,
      })
      .catch(() => []),
  ]);

  const postalAddress = settings['postal.address']?.trim();

  const steps = [
    'On a postcard or a sheet of paper, clearly write your full name, address, email address and daytime telephone number.',
    'State the exact name of the competition you wish to enter (and its closing date). One competition per entry.',
    'Include your answer to that competition’s skill question.',
    'Send it by post to the address below, with one entry per stamped envelope.',
    'Your entry must be received before the competition’s closing date/time to be included in the draw.',
  ];

  return (
    <div className="container-tight py-8">
      <Breadcrumbs items={[{ label: 'Free Postal Entry' }]} />

      <div className="rounded-3xl bg-brand-50 p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-card">
          <Icon name="mail" className="text-[18px]" /> No purchase necessary
        </span>
        <h1 className="mt-4 text-3xl font-bold text-secondaryink sm:text-4xl">Free postal entry</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          Tiny Treasure Competitions are skill-based prize competitions, not a lottery. You can always
          enter any competition <strong>completely free of charge by post</strong>. Postal entries are
          entered into the same draw, on exactly the same terms, as paid online entries.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-secondaryink">How to enter for free by post</h2>
        <ol className="mt-4 space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="text-ink/80">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-secondaryink">Postal entry address</h2>
        <div className="mt-3 card p-5">
          {postalAddress ? (
            <address className="whitespace-pre-line font-medium not-italic text-ink">
              {postalAddress}
            </address>
          ) : (
            <p className="text-muted">
              Please email{' '}
              <a href={`mailto:${siteConfig.contactEmail}`} className="font-semibold text-brand-700">
                {siteConfig.contactEmail}
              </a>{' '}
              to request the current postal entry address.
            </p>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-secondaryink">Important rules</h2>
        <ul className="mt-3 space-y-2 text-ink/80">
          <li className="flex gap-2"><Icon name="check" className="mt-0.5 text-[18px] text-brand-600" /> Entrants must be 18 or over and resident in the United Kingdom.</li>
          <li className="flex gap-2"><Icon name="check" className="mt-0.5 text-[18px] text-brand-600" /> One entry per stamped envelope; bulk or multiple entries in a single envelope are not accepted.</li>
          <li className="flex gap-2"><Icon name="check" className="mt-0.5 text-[18px] text-brand-600" /> Illegible, incomplete or late entries cannot be accepted. Proof of posting is not proof of receipt.</li>
          <li className="flex gap-2"><Icon name="check" className="mt-0.5 text-[18px] text-brand-600" /> Postal entries have the same chance of winning as paid entries and are free of charge.</li>
          <li className="flex gap-2"><Icon name="check" className="mt-0.5 text-[18px] text-brand-600" /> Full details are in our <Link href="/terms" className="font-semibold text-brand-700">Terms &amp; Conditions</Link>.</li>
        </ul>
      </section>

      {comps.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-secondaryink">Current competitions &amp; closing dates</h2>
          <div className="mt-3 card divide-y divide-black/5">
            {comps.map((c) => (
              <div key={c.slug} className="flex items-center justify-between gap-4 p-4">
                <Link href={`/competitions/${c.slug}`} className="font-medium hover:text-brand-700">
                  {c.title}
                </Link>
                <span className="shrink-0 text-sm text-muted">Closes {formatDate(c.closingDate)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 text-center">
        <Link href="/competitions" className="btn-secondary px-6 py-3">
          Browse competitions
        </Link>
      </div>
    </div>
  );
}
