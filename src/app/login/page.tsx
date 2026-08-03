import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { AuthForm } from '@/components/auth/auth-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Log in',
  robots: { index: false, follow: true },
};

export default async function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  const session = await getSession();
  if (session) redirect(searchParams.next || '/account');
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <AuthForm mode="login" next={searchParams.next} />
    </div>
  );
}
