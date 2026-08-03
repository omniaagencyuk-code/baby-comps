import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfileForm } from '@/components/account/profile-form';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await requireUser();
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return null;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Profile &amp; delivery details</h2>
      <ProfileForm
        defaults={{
          name: user.name ?? '',
          phone: user.phone ?? '',
          addressLine1: user.addressLine1 ?? '',
          addressLine2: user.addressLine2 ?? '',
          city: user.city ?? '',
          postcode: user.postcode ?? '',
          marketingOptIn: user.marketingOptIn,
        }}
      />
      <p className="mt-4 text-xs text-ink/50">
        We use your delivery details to send physical prizes. They are never shared with third
        parties.
      </p>
    </div>
  );
}
