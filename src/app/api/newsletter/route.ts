import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { limitByIp } from '@/lib/rate-limit';

const schema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  const limit = limitByIp(req.headers, 'newsletter', { limit: 5, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase();

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email, source: parsed.data.source || 'website' },
    });
  } catch {
    // Fail soft — never block the UX on a storage hiccup.
  }

  return NextResponse.json({ ok: true });
}
