'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';
import { setSessionCookie, clearSessionCookie } from '@/lib/auth';
import { registerSchema, loginSchema } from '@/lib/validation';

export interface AuthState {
  error?: string;
}

function safeNext(next: FormDataEntryValue | null): string {
  const value = typeof next === 'string' ? next : '';
  // Only allow internal, non-protocol-relative paths.
  return value.startsWith('/') && !value.startsWith('//') ? value : '/account';
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    marketingOptIn: formData.get('marketingOptIn') === 'on',
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Please check your details.' };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: 'An account with that email already exists. Try logging in.' };
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: parsed.data.name,
      passwordHash: await hashPassword(parsed.data.password),
      marketingOptIn: parsed.data.marketingOptIn,
    },
  });

  await setSessionCookie({ userId: user.id, email: user.email, role: user.role, name: user.name });
  redirect(safeNext(formData.get('next')));
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: 'Please enter your email and password.' };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { error: 'Incorrect email or password.' };
  }

  await setSessionCookie({ userId: user.id, email: user.email, role: user.role, name: user.name });
  redirect(safeNext(formData.get('next')));
}

export async function logoutAction(): Promise<void> {
  clearSessionCookie();
  redirect('/');
}
