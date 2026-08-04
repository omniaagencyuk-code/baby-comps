import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * One-time bootstrap endpoint to create the first admin user on a fresh
 * production database — so you don't need a local shell.
 *
 * Guarded by the SETUP_TOKEN env var and refuses once an admin already exists.
 * Usage:  GET /api/setup?token=YOUR_SETUP_TOKEN
 * After first use, delete the SETUP_TOKEN env var (the route then no-ops).
 */
export async function GET(req: Request) {
  const expected = process.env.SETUP_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { error: 'Setup is disabled. Set a SETUP_TOKEN env var to enable it once.' },
      { status: 403 },
    );
  }

  const token = new URL(req.url).searchParams.get('token');
  if (token !== expected) {
    return NextResponse.json({ error: 'Invalid setup token.' }, { status: 401 });
  }

  // Verify DB connectivity + that the schema exists.
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    return NextResponse.json({ error: 'Database not reachable.' }, { status: 503 });
  }

  const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (existingAdmin) {
    return NextResponse.json({
      ok: true,
      message: 'An admin already exists — nothing to do. You can remove SETUP_TOKEN now.',
      admin: existingAdmin.email,
    });
  }

  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@tinytreasurecompetitions.com').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: 'Set SEED_ADMIN_PASSWORD (min 8 chars) env var, then retry.' },
      { status: 400 },
    );
  }

  const admin = await prisma.user.create({
    data: {
      email,
      name: 'Site Admin',
      role: 'ADMIN',
      passwordHash: await hashPassword(password),
    },
  });

  return NextResponse.json({
    ok: true,
    message: 'Admin created. Log in at /login, then delete the SETUP_TOKEN env var.',
    admin: admin.email,
  });
}
