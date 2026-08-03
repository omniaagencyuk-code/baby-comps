import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { AdminNav } from '@/components/admin/admin-nav';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid lg:grid-cols-[240px_1fr]">
        <aside className="hidden bg-ink px-4 py-6 lg:block lg:min-h-screen">
          <Link href="/admin" className="mb-8 flex items-center gap-2 px-3 font-display text-lg font-bold text-white">
            <span aria-hidden>🧸</span> Admin
          </Link>
          <AdminNav />
          <Link
            href="/"
            className="mt-8 block px-3 text-sm text-white/50 hover:text-white"
          >
            ← Back to site
          </Link>
        </aside>
        <div className="min-w-0 p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
