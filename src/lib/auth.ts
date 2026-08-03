import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';
import type { Role } from '@prisma/client';

const COOKIE_NAME = 'ttc_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface SessionPayload {
  userId: string;
  email: string;
  role: Role;
  name?: string | null;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET is not set. Add it to your environment.');
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());
}

export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await createSessionToken(payload);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export function clearSessionCookie(): void {
  cookies().set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
}

/** Returns the current session payload, or null if not signed in. */
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as Role,
      name: (payload.name as string | undefined) ?? null,
    };
  } catch {
    return null;
  }
}

/** Load the full current user from the database, or null. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.userId } });
}

/** Require a signed-in user; redirect to login otherwise. */
export async function requireUser(redirectTo = '/login') {
  const session = await getSession();
  if (!session) redirect(redirectTo);
  return session;
}

/** Require an admin; redirect non-admins away. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect('/login?next=/admin');
  if (session.role !== 'ADMIN') redirect('/');
  return session;
}
