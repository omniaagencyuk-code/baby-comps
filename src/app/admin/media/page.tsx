import { prisma } from '@/lib/prisma';
import { AdminPageHeader, AdminCard } from '@/components/admin/ui';
import { MediaUploader } from '@/components/admin/media-uploader';
import { ConfirmSubmit } from '@/components/admin/confirm-submit';
import { deleteMediaAction } from '@/lib/actions/media';

export const dynamic = 'force-dynamic';

function formatBytes(bytes?: number | null) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' }, take: 120 });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media library"
        description="Upload and manage images for competitions, banners, blog posts and winners."
      />

      <MediaUploader folder="library" />

      <AdminCard className="p-5">
        <p className="mb-4 text-xs text-ink/50">
          {media.length} item{media.length === 1 ? '' : 's'}. In production, storage swaps to Vercel
          Blob / Cloudinary via <code className="rounded bg-black/5 px-1">src/lib/storage.ts</code>.
        </p>
        {media.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink/50">
            No media yet — upload your first image above.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {media.map((m) => (
              <div key={m.id} className="group overflow-hidden rounded-xl border border-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt ?? ''} className="aspect-square w-full object-cover" />
                <div className="flex items-center justify-between gap-2 p-2 text-xs">
                  <span className="truncate text-ink/50" title={m.filename ?? m.url}>
                    {formatBytes(m.bytes) || m.folder}
                  </span>
                  <form action={deleteMediaAction.bind(null, m.id)}>
                    <ConfirmSubmit confirm="Delete this image?" className="text-red-500 hover:underline">
                      Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
