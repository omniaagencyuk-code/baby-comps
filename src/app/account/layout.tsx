import { requireUser } from '@/lib/auth';
import { AccountNav } from '@/components/account/account-nav';

export const dynamic = 'force-dynamic';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUser('/login?next=/account');
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My account</h1>
        <p className="text-sm text-ink/60">Signed in as {session.email}</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AccountNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
