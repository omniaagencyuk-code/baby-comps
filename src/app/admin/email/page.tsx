import { prisma } from '@/lib/prisma';
import { AdminPageHeader, StatCard, AdminCard } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

const templates = [
  { name: 'Order confirmation', trigger: 'On successful payment', status: 'Ready' },
  { name: 'Winner notification', trigger: 'When a winner is drawn', status: 'Ready' },
  { name: 'Draw reminder', trigger: '24h before closing', status: 'Ready' },
  { name: 'Welcome email', trigger: 'On registration', status: 'Ready' },
];

export default async function AdminEmailPage() {
  const subscribers = await prisma.user.count({ where: { marketingOptIn: true } });
  const customers = await prisma.user.count({ where: { role: 'USER' } });

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Email" description="Transactional and marketing email." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Marketing subscribers" value={subscribers.toLocaleString()} />
        <StatCard label="Total customers" value={customers.toLocaleString()} />
        <StatCard
          label="Opt-in rate"
          value={customers ? `${Math.round((subscribers / customers) * 100)}%` : '—'}
        />
      </div>
      <AdminCard className="p-5">
        <p className="mb-4 rounded-xl bg-brand-50 px-4 py-3 text-sm text-ink/70">
          💡 Connect an email provider (Resend, Postmark or SendGrid) via environment variables to
          enable sending. The templates below fire from the relevant server actions and webhooks.
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-ink/50">
              <th className="py-2 font-medium">Template</th>
              <th className="py-2 font-medium">Trigger</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.name} className="border-b border-black/5 last:border-0">
                <td className="py-2 font-medium">{t.name}</td>
                <td className="py-2 text-ink/60">{t.trigger}</td>
                <td className="py-2 text-emerald-600">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </div>
  );
}
