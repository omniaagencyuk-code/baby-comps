'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { competitionSchema } from '@/lib/validation';
import { slugify } from '@/lib/utils';

export interface FormState {
  error?: string;
  success?: string;
}

async function logAudit(action: string, entity: string, entityId?: string, meta?: unknown) {
  const session = await requireAdmin();
  await prisma.auditLog.create({
    data: { action, entity, entityId, meta: meta as never, userId: session.userId },
  });
}

// ---- Competitions -------------------------------------------------

function parseCompetitionForm(formData: FormData) {
  const answerOptions = String(formData.get('answerOptions') || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  return competitionSchema.safeParse({
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    terms: formData.get('terms'),
    heroImage: formData.get('heroImage'),
    retailValue: Math.round(Number(formData.get('retailValue')) * 100),
    ticketPrice: Math.round(Number(formData.get('ticketPrice')) * 100),
    maxEntries: formData.get('maxEntries'),
    maxPerUser: formData.get('maxPerUser') ? Number(formData.get('maxPerUser')) : null,
    drawDate: formData.get('drawDate'),
    closingDate: formData.get('closingDate'),
    skillQuestion: formData.get('skillQuestion'),
    answerOptions,
    correctAnswer: formData.get('correctAnswer'),
    status: formData.get('status'),
    featured: formData.get('featured') === 'on',
    metaTitle: formData.get('metaTitle'),
    metaDescription: formData.get('metaDescription'),
    categoryId: formData.get('categoryId'),
  });
}

export async function saveCompetitionAction(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = parseCompetitionForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Please check the form.' };
  }
  const d = parsed.data;
  const slug = d.slug ? slugify(d.slug) : slugify(d.title);

  const data = {
    title: d.title,
    subtitle: d.subtitle || null,
    slug,
    description: d.description,
    terms: d.terms || null,
    heroImage: d.heroImage || null,
    images: d.heroImage ? [d.heroImage] : [],
    retailValue: d.retailValue,
    ticketPrice: d.ticketPrice,
    maxEntries: d.maxEntries,
    maxPerUser: d.maxPerUser ?? null,
    drawDate: d.drawDate,
    closingDate: d.closingDate,
    skillQuestion: d.skillQuestion || null,
    answerOptions: d.answerOptions,
    correctAnswer: d.correctAnswer || null,
    status: d.status,
    featured: d.featured,
    metaTitle: d.metaTitle || null,
    metaDescription: d.metaDescription || null,
    categoryId: d.categoryId || null,
  };

  try {
    if (id) {
      await prisma.competition.update({ where: { id }, data });
      await logAudit('competition.update', 'Competition', id);
    } else {
      const created = await prisma.competition.create({ data });
      await logAudit('competition.create', 'Competition', created.id);
    }
  } catch (e) {
    return { error: 'Could not save — is the slug unique?' };
  }

  revalidatePath('/admin/competitions');
  redirect('/admin/competitions');
}

export async function deleteCompetitionAction(id: string): Promise<void> {
  await requireAdmin();
  await prisma.competition.delete({ where: { id } });
  await logAudit('competition.delete', 'Competition', id);
  revalidatePath('/admin/competitions');
}

// ---- Winners ------------------------------------------------------

export async function drawWinnerAction(competitionId: string): Promise<void> {
  await requireAdmin();
  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    include: { entries: { where: { status: 'CONFIRMED' } } },
  });
  if (!comp) return;

  let winnerUserId: string | null = null;
  let winnerName = 'Lucky Entrant';
  let ticketNumber: number | null = null;

  if (comp.entries.length > 0) {
    const idx = Math.floor(Math.random() * comp.entries.length);
    const entry = comp.entries[idx];
    ticketNumber = entry.ticketNumber;
    winnerUserId = entry.userId;
    const user = await prisma.user.findUnique({ where: { id: entry.userId } });
    winnerName = user?.name || user?.email?.split('@')[0] || winnerName;
  } else if (comp.entriesSold > 0) {
    ticketNumber = Math.floor(Math.random() * comp.entriesSold) + 1;
  }

  await prisma.$transaction([
    prisma.winner.upsert({
      where: { competitionId },
      update: { userId: winnerUserId, name: winnerName, ticketNumber, prizeTitle: comp.title },
      create: {
        competitionId,
        userId: winnerUserId,
        name: winnerName,
        ticketNumber,
        prizeTitle: comp.title,
        image: comp.heroImage,
        published: false,
      },
    }),
    prisma.competition.update({ where: { id: competitionId }, data: { status: 'DRAWN' } }),
  ]);

  await logAudit('winner.draw', 'Competition', competitionId, { ticketNumber });
  revalidatePath('/admin/winners');
  revalidatePath('/winners');
}

export async function updateWinnerAction(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  await prisma.winner.update({
    where: { id },
    data: {
      name: String(formData.get('name') || ''),
      location: String(formData.get('location') || '') || null,
      quote: String(formData.get('quote') || '') || null,
      image: String(formData.get('image') || '') || null,
      published: formData.get('published') === 'on',
    },
  });
  revalidatePath('/admin/winners');
  revalidatePath('/winners');
  return { success: 'Winner updated.' };
}

// ---- Blog ---------------------------------------------------------

export async function saveBlogPostAction(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const title = String(formData.get('title') || '').trim();
  const content = String(formData.get('content') || '').trim();
  if (!title || !content) return { error: 'Title and content are required.' };

  const slug = slugify(String(formData.get('slug') || '') || title);
  const published = formData.get('published') === 'on';
  const data = {
    title,
    slug,
    excerpt: String(formData.get('excerpt') || '') || null,
    content,
    coverImage: String(formData.get('coverImage') || '') || null,
    author: String(formData.get('author') || 'Tiny Treasure Team'),
    published,
    publishedAt: published ? new Date() : null,
  };

  try {
    if (id) await prisma.blogPost.update({ where: { id }, data });
    else await prisma.blogPost.create({ data });
  } catch {
    return { error: 'Could not save — is the slug unique?' };
  }
  revalidatePath('/admin/blog');
  redirect('/admin/blog');
}

export async function deleteBlogPostAction(id: string): Promise<void> {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath('/admin/blog');
}

// ---- Coupons ------------------------------------------------------

export async function createCouponAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const code = String(formData.get('code') || '').trim().toUpperCase();
  if (!code) return { error: 'Code is required.' };
  const type = formData.get('type') === 'FIXED' ? 'FIXED' : 'PERCENT';
  const rawValue = Number(formData.get('value')) || 0;
  const value = type === 'FIXED' ? Math.round(rawValue * 100) : rawValue;

  try {
    await prisma.coupon.create({ data: { code, type, value, active: true } });
  } catch {
    return { error: 'A coupon with that code already exists.' };
  }
  revalidatePath('/admin/coupons');
  return { success: `Coupon ${code} created.` };
}

// ---- Settings -----------------------------------------------------

export async function updateSettingsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const entries = Array.from(formData.entries()).filter(([k]) => k.startsWith('setting.'));
  for (const [key, value] of entries) {
    const settingKey = key.replace('setting.', '');
    await prisma.siteSetting.upsert({
      where: { key: settingKey },
      update: { value: String(value) },
      create: { key: settingKey, value: String(value) },
    });
  }
  revalidatePath('/admin/settings');
  return { success: 'Settings saved.' };
}
