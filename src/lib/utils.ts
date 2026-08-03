import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an integer amount of pence as GBP, e.g. 1250 -> "£12.50". */
export function formatMoney(pence: number, opts: { showPence?: boolean } = {}): string {
  const value = pence / 100;
  const showPence = opts.showPence ?? value % 1 !== 0;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: showPence ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Convert a title to a URL-friendly slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Human-friendly date, e.g. "3 August 2026". */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/** Format a Date for an <input type="datetime-local"> value (yyyy-MM-ddTHH:mm). */
export function toInputDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Percentage of tickets sold (0-100), clamped. */
export function soldPercent(entriesSold: number, maxEntries: number): number {
  if (maxEntries <= 0) return 0;
  return Math.min(100, Math.round((entriesSold / maxEntries) * 100));
}

/** Generate a human-readable order number. */
export function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TTC-${stamp}-${rand}`;
}

/** Deterministic pseudo-random winner selection from a seed string. */
export function pickTicketFromSeed(seed: string, ticketCount: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  return (positive % ticketCount) + 1; // 1-indexed ticket number
}
