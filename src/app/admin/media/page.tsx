import { prisma } from '@/lib/prisma';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' }, take: 60 });

  return (
    <div>
      <AdminPageHeader
        title="Media library"
        description="Images used across competitions, blog posts and winners."
      />
      <AdminCard className="p-5">
        <p className="mb-4 rounded-xl bg-brand-50 px-4 py-3 text-sm text-ink/70">
          💡 Images are referenced by URL throughout the CMS. For production, connect an uploader such
          as Vercel Blob, Cloudinary or UploadThing and store each asset here. Add allowed hosts in{' '}
          <code className="rounded bg-black/5 px-1">next.config.mjs</code>.
        </p>
        {media.length === 0 ? (
          <p className="text-sm text-ink/50">No media uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {media.map((m) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={m.id}
                src={m.url}
                alt={m.alt ?? ''}
                className="aspect-square w-full rounded-xl object-cover"
              />
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
