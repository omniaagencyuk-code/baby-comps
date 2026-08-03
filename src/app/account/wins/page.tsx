import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function WinsPage() {
  const session = await requireUser();
  const wins = await prisma.winner.findMany({
    where: { userId: session.userId },
    orderBy: { drawnAt: 'desc' },
    include: { competition: { select: { slug: true } } },
  });

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">My wins</h2>
      {wins.length === 0 ? (
        <div className="card p-8 text-center text-ink/60">
          No wins yet — but your next entry could change that! 🍀{' '}
          <Link href="/competitions" className="font-semibold text-brand-600">
            Enter now
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {wins.map((w) => (
            <div key={w.id} className="card overflow-hidden">
              {w.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={w.image} alt={w.prizeTitle} className="aspect-video w-full object-cover" />
              )}
              <div className="p-5">
                <p className="text-2xl">🏆</p>
                <h3 className="mt-1 font-semibold">{w.prizeTitle}</h3>
                {w.ticketNumber && (
                  <p className="text-sm text-ink/60">Winning ticket #{w.ticketNumber}</p>
                )}
                <p className="mt-1 text-xs text-ink/50">Drawn {formatDate(w.drawnAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
