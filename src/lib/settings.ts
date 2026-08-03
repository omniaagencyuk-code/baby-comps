import { prisma } from './prisma';

/** Fetch all site settings as a key/value map, with sensible fallbacks. */
export async function getSettings(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

export async function getSetting(key: string, fallback = ''): Promise<string> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    return row?.value ?? fallback;
  } catch {
    return fallback;
  }
}
