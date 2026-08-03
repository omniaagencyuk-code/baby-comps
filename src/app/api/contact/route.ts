import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
  }

  // Persist as an audit log entry. In production this would also send an email
  // (e.g. via Resend / SendGrid) — see the Email admin module.
  try {
    await prisma.auditLog.create({
      data: {
        action: 'contact.message',
        entity: 'Contact',
        meta: parsed.data,
      },
    });
  } catch {
    // Non-fatal in demo mode without a database.
  }

  return NextResponse.json({ ok: true });
}
