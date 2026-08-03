import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CompetitionGrid } from '@/components/competition/competition-grid';

export const dynamic = 'force-dynamic';

export default async function SavedPage() {
  const session = await requireUser();
  const saved = await prisma.savedCompetition.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: {
      competition: {
        select: {
          slug: true,
          title: true,
          subtitle: true,
          heroImage: true,
          retailValue: true,
          ticketPrice: true,
          maxEntries: true,
          entriesSold: true,
          closingDate: true,
          featured: true,
        },
      },
    },
  });

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Saved competitions</h2>
      <CompetitionGrid
        competitions={saved.map((s) => s.competition)}
        emptyMessage="You haven't saved any competitions yet. Tap the heart on any competition to save it here."
      />
    </div>
  );
}
