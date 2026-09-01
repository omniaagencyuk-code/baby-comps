import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import { put, del } from '@vercel/blob';
import { slugify } from './utils';

/**
 * Storage abstraction for uploaded media.
 *
 * - When `BLOB_READ_WRITE_TOKEN` is present (Vercel Blob store connected), files
 *   are uploaded to Vercel Blob and persist across deploys — the correct
 *   production setup.
 * - Otherwise it falls back to writing to the local `public/uploads` directory,
 *   which works out-of-the-box in local development.
 */

const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'];

export interface SavedUpload {
  url: string;
  filename: string;
  bytes: number;
  type: string;
}

export async function saveUpload(file: File, folder = 'general'): Promise<SavedUpload> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error('Unsupported file type. Please upload an image.');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('File is too large (max 8MB).');
  }

  const safeFolder = slugify(folder) || 'general';
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image';
  // Uniqueness without Math.random() (unavailable in some runtimes here it's fine,
  // but keep it deterministic-ish using time + counter-free suffix).
  const unique = `${base}-${Date.now().toString(36)}.${ext}`;

  // Production: Vercel Blob (persists across deploys).
  if (blobEnabled()) {
    const blob = await put(`${safeFolder}/${unique}`, file, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type,
    });
    return { url: blob.url, filename: unique, bytes: file.size, type: file.type };
  }

  // Local dev: write to public/uploads.
  const dir = path.join(UPLOAD_DIR, safeFolder);
  await fs.mkdir(dir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, unique), bytes);

  return {
    url: `/uploads/${safeFolder}/${unique}`,
    filename: unique,
    bytes: file.size,
    type: file.type,
  };
}

/** Delete an uploaded file (Blob URL or local path). No-op for external URLs. */
export async function deleteUpload(url: string): Promise<void> {
  if (url.includes('.blob.vercel-storage.com')) {
    await del(url).catch(() => undefined);
    return;
  }
  if (!url.startsWith('/uploads/')) return;
  const target = path.join(process.cwd(), 'public', url.replace(/^\//, ''));
  await fs.rm(target, { force: true }).catch(() => undefined);
}
