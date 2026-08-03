'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteUpload } from '@/lib/storage';

export async function deleteMediaAction(id: string): Promise<void> {
  await requireAdmin();
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return;
  await deleteUpload(media.url);
  await prisma.media.delete({ where: { id } });
  revalidatePath('/admin/media');
}

export async function updateMediaAltAction(id: string, alt: string): Promise<void> {
  await requireAdmin();
  await prisma.media.update({ where: { id }, data: { alt: alt || null } });
  revalidatePath('/admin/media');
}
