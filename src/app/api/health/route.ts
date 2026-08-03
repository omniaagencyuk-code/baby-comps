import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getConfigStatus, stripeMode, isProduction } from '@/lib/env';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Lightweight health check for uptime monitors and deploy verification.
 * Reports database connectivity and (non-secret) configuration status.
 * Returns 200 when the database is reachable, 503 otherwise.
 */
export async function GET() {
  let database = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    database = true;
  } catch {
    database = false;
  }

  const config = getConfigStatus();
  const body = {
    status: database ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: isProduction ? 'production' : 'development',
    checks: {
      database,
      stripe: stripeMode(),
    },
    config: config.map(({ key, ok, required, detail }) => ({ key, ok, required, detail })),
  };

  return NextResponse.json(body, { status: database ? 200 : 503 });
}
