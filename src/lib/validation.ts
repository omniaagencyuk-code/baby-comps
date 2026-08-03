import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Please enter your name').max(80),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  marketingOptIn: z.coerce.boolean().optional().default(false),
});

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().max(30).optional().or(z.literal('')),
  addressLine1: z.string().max(120).optional().or(z.literal('')),
  addressLine2: z.string().max(120).optional().or(z.literal('')),
  city: z.string().max(80).optional().or(z.literal('')),
  postcode: z.string().max(12).optional().or(z.literal('')),
  marketingOptIn: z.coerce.boolean().optional().default(false),
});

export const checkoutSchema = z.object({
  competitionId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(1000),
  answer: z.string().optional(),
  couponCode: z.string().optional(),
});

export const competitionSchema = z.object({
  title: z.string().min(3).max(160),
  subtitle: z.string().max(200).optional().or(z.literal('')),
  slug: z.string().min(3).max(160).optional().or(z.literal('')),
  description: z.string().min(10),
  terms: z.string().optional().or(z.literal('')),
  heroImage: z.string().url().optional().or(z.literal('')),
  retailValue: z.coerce.number().int().min(0), // pence
  ticketPrice: z.coerce.number().int().min(0), // pence
  maxEntries: z.coerce.number().int().min(1),
  maxPerUser: z.coerce.number().int().min(1).optional().nullable(),
  drawDate: z.coerce.date(),
  closingDate: z.coerce.date(),
  skillQuestion: z.string().optional().or(z.literal('')),
  answerOptions: z.array(z.string()).optional().default([]),
  correctAnswer: z.string().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'DRAWN']),
  featured: z.coerce.boolean().optional().default(false),
  metaTitle: z.string().optional().or(z.literal('')),
  metaDescription: z.string().optional().or(z.literal('')),
  categoryId: z.string().optional().or(z.literal('')),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CompetitionInput = z.infer<typeof competitionSchema>;
