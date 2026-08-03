'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import type { FormState } from '@/lib/actions/admin';

export async function createCategoryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const name = String(formData.get('name') || '').trim();
  if (!name) return { error: 'Category name is required.' };
  const slug = slugify(String(formData.get('slug') || '') || name);
  try {
    await prisma.category.create({
      data: { name, slug, description: String(formData.get('description') || '') || null },
    });
  } catch {
    return { error: 'A category with that name or slug already exists.' };
  }
  revalidatePath('/admin/categories');
  revalidatePath('/competitions');
  return { success: `Category “${name}” created.` };
}

export async function updateCategoryAction(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const name = String(formData.get('name') || '').trim();
  if (!name) return { error: 'Category name is required.' };
  const slug = slugify(String(formData.get('slug') || '') || name);
  try {
    await prisma.category.update({
      where: { id },
      data: { name, slug, description: String(formData.get('description') || '') || null },
    });
  } catch {
    return { error: 'Could not update — is the slug unique?' };
  }
  revalidatePath('/admin/categories');
  revalidatePath('/competitions');
  return { success: 'Category updated.' };
}

/** Delete a category, detaching any competitions/posts first (kept, uncategorised). */
export async function deleteCategoryAction(id: string): Promise<void> {
  await requireAdmin();
  await prisma.$transaction([
    prisma.competition.updateMany({ where: { categoryId: id }, data: { categoryId: null } }),
    prisma.blogPost.updateMany({ where: { categoryId: id }, data: { categoryId: null } }),
    prisma.category.delete({ where: { id } }),
  ]);
  revalidatePath('/admin/categories');
  revalidatePath('/competitions');
}
