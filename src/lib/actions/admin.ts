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

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 2;
  while (await prisma.competition.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

/** Clone a competition (or template) into a fresh DRAFT with zeroed sales. */
export async function duplicateCompetitionAction(id: string): Promise<void> {
  await requireAdmin();
  const src = await prisma.competition.findUnique({ where: { id } });
  if (!src) return;
  const slug = await uniqueSlug(`${slugify(src.title)}-copy`);

  const created = await prisma.competition.create({
    data: {
      slug,
      title: `${src.title} (copy)`,
      subtitle: src.subtitle,
      description: src.description,
      terms: src.terms,
      heroImage: src.heroImage,
      images: src.images,
      retailValue: src.retailValue,
      ticketPrice: src.ticketPrice,
      maxEntries: src.maxEntries,
      maxPerUser: src.maxPerUser,
      drawDate: src.drawDate,
      closingDate: src.closingDate,
      skillQuestion: src.skillQuestion,
      answerOptions: src.answerOptions,
      correctAnswer: src.correctAnswer,
      status: 'DRAFT',
      featured: false,
      archived: false,
      isTemplate: false,
      entriesSold: 0,
      metaTitle: src.metaTitle,
      metaDescription: src.metaDescription,
      categoryId: src.categoryId,
    },
  });
  await logAudit('competition.duplicate', 'Competition', created.id, { from: id });
  revalidatePath('/admin/competitions');
  redirect(`/admin/competitions/${created.id}`);
}

/** Instantiate a NEW draft competition from a template. */
export async function useTemplateAction(id: string): Promise<void> {
  await requireAdmin();
  const tpl = await prisma.competition.findUnique({ where: { id } });
  if (!tpl || !tpl.isTemplate) return;
  const slug = await uniqueSlug(slugify(tpl.title));
  const created = await prisma.competition.create({
    data: {
      slug,
      title: tpl.title,
      subtitle: tpl.subtitle,
      description: tpl.description,
      terms: tpl.terms,
      heroImage: tpl.heroImage,
      images: tpl.images,
      retailValue: tpl.retailValue,
      ticketPrice: tpl.ticketPrice,
      maxEntries: tpl.maxEntries,
      maxPerUser: tpl.maxPerUser,
      drawDate: tpl.drawDate,
      closingDate: tpl.closingDate,
      skillQuestion: tpl.skillQuestion,
      answerOptions: tpl.answerOptions,
      correctAnswer: tpl.correctAnswer,
      status: 'DRAFT',
      isTemplate: false,
      categoryId: tpl.categoryId,
    },
  });
  await logAudit('competition.fromTemplate', 'Competition', created.id, { template: id });
  revalidatePath('/admin/competitions');
  redirect(`/admin/competitions/${created.id}`);
}

/** Turn a competition into a reusable template (clones it as a template). */
export async function saveAsTemplateAction(id: string): Promise<void> {
  await requireAdmin();
  const src = await prisma.competition.findUnique({ where: { id } });
  if (!src) return;
  const slug = await uniqueSlug(`tpl-${slugify(src.title)}`);
  await prisma.competition.create({
    data: {
      slug,
      title: src.title,
      subtitle: src.subtitle,
      description: src.description,
      terms: src.terms,
      heroImage: src.heroImage,
      images: src.images,
      retailValue: src.retailValue,
      ticketPrice: src.ticketPrice,
      maxEntries: src.maxEntries,
      maxPerUser: src.maxPerUser,
      drawDate: src.drawDate,
      closingDate: src.closingDate,
      skillQuestion: src.skillQuestion,
      answerOptions: src.answerOptions,
      correctAnswer: src.correctAnswer,
      status: 'DRAFT',
      isTemplate: true,
      categoryId: src.categoryId,
    },
  });
  await logAudit('competition.saveAsTemplate', 'Competition', id);
  revalidatePath('/admin/competitions');
  redirect('/admin/competitions?view=templates');
}

export async function setArchivedAction(id: string, archived: boolean): Promise<void> {
  await requireAdmin();
  await prisma.competition.update({ where: { id }, data: { archived } });
  await logAudit(archived ? 'competition.archive' : 'competition.restore', 'Competition', id);
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

/** Manually create a winner for a competition (no random draw). */
export async function createWinnerManualAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const competitionId = String(formData.get('competitionId') || '');
  const name = String(formData.get('name') || '').trim();
  if (!competitionId || !name) return { error: 'Competition and winner name are required.' };

  const comp = await prisma.competition.findUnique({
    where: { id: competitionId },
    include: { winner: true },
  });
  if (!comp) return { error: 'Competition not found.' };
  if (comp.winner) return { error: 'This competition already has a winner.' };

  const ticketRaw = Number(formData.get('ticketNumber'));

  await prisma.$transaction([
    prisma.winner.create({
      data: {
        competitionId,
        name,
        location: String(formData.get('location') || '') || null,
        ticketNumber: ticketRaw > 0 ? Math.floor(ticketRaw) : null,
        prizeTitle: comp.title,
        image: String(formData.get('image') || '') || comp.heroImage,
        quote: String(formData.get('quote') || '') || null,
        published: formData.get('published') === 'on',
      },
    }),
    prisma.competition.update({ where: { id: competitionId }, data: { status: 'DRAWN' } }),
  ]);

  await logAudit('winner.manual', 'Competition', competitionId);
  revalidatePath('/admin/winners');
  revalidatePath('/winners');
  return { success: `Winner added for “${comp.title}”.` };
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
  const minSpendRaw = Number(formData.get('minSpend'));
  const maxRedemptionsRaw = Number(formData.get('maxRedemptions'));
  const expiresRaw = String(formData.get('expiresAt') || '');

  try {
    await prisma.coupon.create({
      data: {
        code,
        type,
        value,
        active: true,
        minSpend: minSpendRaw > 0 ? Math.round(minSpendRaw * 100) : null,
        maxRedemptions: maxRedemptionsRaw > 0 ? Math.floor(maxRedemptionsRaw) : null,
        expiresAt: expiresRaw ? new Date(expiresRaw) : null,
      },
    });
  } catch {
    return { error: 'A coupon with that code already exists.' };
  }
  revalidatePath('/admin/coupons');
  return { success: `Coupon ${code} created.` };
}

export async function toggleCouponAction(id: string, active: boolean): Promise<void> {
  await requireAdmin();
  await prisma.coupon.update({ where: { id }, data: { active } });
  revalidatePath('/admin/coupons');
}

export async function deleteCouponAction(id: string): Promise<void> {
  await requireAdmin();
  await prisma.coupon.delete({ where: { id } });
  revalidatePath('/admin/coupons');
}

// ---- Homepage content blocks --------------------------------------

export async function updateHeroAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const get = (k: string) => String(formData.get(k) || '');
  const data = {
    badge: get('badge'),
    titleLead: get('titleLead'),
    titleHighlight: get('titleHighlight'),
    titleTail: get('titleTail'),
    subtitle: get('subtitle'),
    primaryCtaLabel: get('primaryCtaLabel'),
    primaryCtaHref: get('primaryCtaHref'),
    secondaryCtaLabel: get('secondaryCtaLabel'),
    secondaryCtaHref: get('secondaryCtaHref'),
    image: get('image'),
    winnerCaption: get('winnerCaption'),
  };
  await prisma.contentBlock.upsert({
    where: { key: 'home.hero' },
    update: { data },
    create: { key: 'home.hero', label: 'Homepage hero', data },
  });
  revalidatePath('/');
  revalidatePath('/admin/content');
  return { success: 'Hero updated.' };
}

/** Parse a textarea of "icon | title | text" lines into an items block. */
export async function updateIconBlockAction(
  key: string,
  label: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const raw = String(formData.get('items') || '');
  const items = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [icon, title, text] = line.split('|').map((s) => s.trim());
      return { icon: icon || '⭐', title: title || '', text: text || '' };
    })
    .filter((i) => i.title);

  await prisma.contentBlock.upsert({
    where: { key },
    update: { data: { items } },
    create: { key, label, data: { items } },
  });
  revalidatePath('/');
  revalidatePath('/admin/content');
  return { success: 'Section updated.' };
}

// ---- Reviews ------------------------------------------------------

export async function createReviewAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const name = String(formData.get('name') || '').trim();
  const quote = String(formData.get('quote') || '').trim();
  if (!name || !quote) return { error: 'Name and quote are required.' };
  await prisma.review.create({
    data: {
      name,
      quote,
      location: String(formData.get('location') || '') || null,
      rating: Math.max(1, Math.min(5, Number(formData.get('rating')) || 5)),
      published: true,
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/content');
  return { success: 'Review added.' };
}

export async function toggleReviewAction(id: string, published: boolean): Promise<void> {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { published } });
  revalidatePath('/');
  revalidatePath('/admin/content');
}

export async function deleteReviewAction(id: string): Promise<void> {
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/content');
}

// ---- CMS pages ----------------------------------------------------

export async function savePageAction(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const title = String(formData.get('title') || '').trim();
  const content = String(formData.get('content') || '').trim();
  if (!title || !content) return { error: 'Title and content are required.' };
  const slug = slugify(String(formData.get('slug') || '') || title);
  const data = {
    title,
    slug,
    content,
    metaTitle: String(formData.get('metaTitle') || '') || null,
    metaDescription: String(formData.get('metaDescription') || '') || null,
    published: formData.get('published') === 'on',
  };
  try {
    if (id) await prisma.page.update({ where: { id }, data });
    else await prisma.page.create({ data });
  } catch {
    return { error: 'Could not save — is the slug unique?' };
  }
  revalidatePath(`/${slug}`);
  redirect('/admin/pages');
}

export async function deletePageAction(id: string): Promise<void> {
  await requireAdmin();
  await prisma.page.delete({ where: { id } });
  revalidatePath('/admin/pages');
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
