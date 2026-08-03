import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { limitByIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/** Toggle a saved competition for the current user. */
export async function POST(req: Request) {
  const limit = limitByIp(req.headers, 'saved', { limit: 40, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests.', saved: false }, { status: 429 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'auth', saved: false }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const competitionId = body?.competitionId as string | undefined;
  if (!competitionId) {
    return NextResponse.json({ error: 'Missing competitionId' }, { status: 400 });
  }

  const existing = await prisma.savedCompetition.findUnique({
    where: { userId_competitionId: { userId: session.userId, competitionId } },
  });

  if (existing) {
    await prisma.savedCompetition.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedCompetition.create({
    data: { userId: session.userId, competitionId },
  });
  return NextResponse.json({ saved: true });
}
