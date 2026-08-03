import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import { slugify } from './utils';

/**
 * Storage abstraction for uploaded media.
 *
 * The default implementation writes to the local `public/uploads` directory,
 * which works out-of-the-box in development. For production on Vercel (where the
 * filesystem is read-only/ephemeral), swap `saveUpload` for a provider such as
 * Vercel Blob, Cloudinary or UploadThing — this is the single integration point.
 */

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

/** Delete a locally-stored upload (no-op for external URLs). */
export async function deleteUpload(url: string): Promise<void> {
  if (!url.startsWith('/uploads/')) return;
  const target = path.join(process.cwd(), 'public', url.replace(/^\//, ''));
  await fs.rm(target, { force: true }).catch(() => undefined);
}
