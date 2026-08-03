import { soldPercent } from '@/lib/utils';

export function ProgressBar({
  entriesSold,
  maxEntries,
  showLabel = true,
}: {
  entriesSold: number;
  maxEntries: number;
  showLabel?: boolean;
}) {
  const pct = soldPercent(entriesSold, maxEntries);
  const remaining = Math.max(0, maxEntries - entriesSold);
  return (
    <div>
      {showLabel && (
        <div className="mb-1.5 flex justify-between text-xs font-medium text-ink/70">
          <span>{entriesSold.toLocaleString()} sold</span>
          <span>{remaining.toLocaleString()} left</span>
        </div>
      )}
      <div
        className="relative h-2.5 w-full overflow-hidden rounded-full bg-brand-100"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-shimmer relative h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
