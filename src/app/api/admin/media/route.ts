import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { saveUpload } from '@/lib/storage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function requireAdminApi() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return null;
  return session;
}

/** List media (for the picker). Optional ?folder= and ?q= filters. */
export async function GET(req: Request) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get('folder') || undefined;
  const q = searchParams.get('q') || undefined;

  const media = await prisma.media.findMany({
    where: {
      ...(folder ? { folder } : {}),
      ...(q ? { OR: [{ alt: { contains: q, mode: 'insensitive' } }, { filename: { contains: q, mode: 'insensitive' } }] } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return NextResponse.json({ media });
}

/** Upload an image (multipart/form-data: file, folder?, alt?). */
export async function POST(req: Request) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }
  const folder = String(form?.get('folder') || 'general');
  const alt = String(form?.get('alt') || '') || null;

  try {
    const saved = await saveUpload(file, folder);
    const media = await prisma.media.create({
      data: {
        url: saved.url,
        filename: saved.filename,
        alt,
        folder,
        type: saved.type,
        bytes: saved.bytes,
      },
    });
    return NextResponse.json({ media });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
