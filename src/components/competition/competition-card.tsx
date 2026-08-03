import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Countdown } from './countdown';
import { ProgressBar } from './progress-bar';
import { formatMoney, soldPercent } from '@/lib/utils';

export interface CompetitionCardData {
  slug: string;
  title: string;
  subtitle?: string | null;
  heroImage?: string | null;
  retailValue: number;
  ticketPrice: number;
  maxEntries: number;
  entriesSold: number;
  closingDate: Date | string;
  featured?: boolean;
}

export function CompetitionCard({ comp }: { comp: CompetitionCardData }) {
  const pct = soldPercent(comp.entriesSold, comp.maxEntries);
  const nearlyGone = pct >= 85;

  return (
    <article className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-card-hover">
      <Link href={`/competitions/${comp.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        {comp.heroImage ? (
          <Image
            src={comp.heroImage}
            alt={comp.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-100 text-brand-400">
            No image
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {comp.featured && <Badge tone="brand">Featured</Badge>}
          {nearlyGone && <Badge tone="amber">Almost gone</Badge>}
        </div>
        <div className="absolute right-3 top-3">
          <Badge tone="slate">Worth {formatMoney(comp.retailValue)}</Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-ink/60">
          <span>Draw closes in</span>
          <Countdown to={comp.closingDate} compact />
        </div>

        <h3 className="mb-1 line-clamp-2 font-display text-lg font-semibold leading-snug">
          <Link href={`/competitions/${comp.slug}`} className="hover:text-brand-600">
            {comp.title}
          </Link>
        </h3>
        {comp.subtitle && (
          <p className="mb-3 line-clamp-2 text-sm text-ink/60">{comp.subtitle}</p>
        )}

        <div className="mt-auto space-y-3">
          <ProgressBar entriesSold={comp.entriesSold} maxEntries={comp.maxEntries} />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-ink/50">from</span>
              <p className="text-xl font-bold text-brand-600">
                {formatMoney(comp.ticketPrice)}
                <span className="text-sm font-normal text-ink/50"> / entry</span>
              </p>
            </div>
            <Link
              href={`/competitions/${comp.slug}`}
              className="btn-primary px-4 py-2 text-sm"
            >
              Enter now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
