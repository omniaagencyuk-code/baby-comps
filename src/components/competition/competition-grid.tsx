import { CompetitionCard, type CompetitionCardData } from './competition-card';

export function CompetitionGrid({
  competitions,
  emptyMessage = 'No competitions to show right now — check back soon!',
}: {
  competitions: CompetitionCardData[];
  emptyMessage?: string;
}) {
  if (competitions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-ink/50">
        {emptyMessage}
      </div>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {competitions.map((c) => (
        <CompetitionCard key={c.slug} comp={c} />
      ))}
    </div>
  );
}
