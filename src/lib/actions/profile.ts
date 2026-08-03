'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { profileSchema } from '@/lib/validation';

export interface ProfileState {
  error?: string;
  success?: boolean;
}

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const session = await getSession();
  if (!session) return { error: 'Not signed in.' };

  const parsed = profileSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    addressLine1: formData.get('addressLine1'),
    addressLine2: formData.get('addressLine2'),
    city: formData.get('city'),
    postcode: formData.get('postcode'),
    marketingOptIn: formData.get('marketingOptIn') === 'on',
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Please check your details.' };
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      addressLine1: parsed.data.addressLine1 || null,
      addressLine2: parsed.data.addressLine2 || null,
      city: parsed.data.city || null,
      postcode: parsed.data.postcode || null,
      marketingOptIn: parsed.data.marketingOptIn,
    },
  });

  revalidatePath('/account/profile');
  return { success: true };
}
