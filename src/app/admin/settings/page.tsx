import { getSettings } from '@/lib/settings';
import { AdminPageHeader } from '@/components/admin/ui';
import { SettingsForm } from '@/components/admin/settings-form';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <AdminPageHeader title="Settings" description="Site-wide content and trust signals." />
      <SettingsForm values={settings} />
    </div>
  );
}
