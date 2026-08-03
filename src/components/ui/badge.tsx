import { cn } from '@/lib/utils';

type Tone = 'brand' | 'green' | 'amber' | 'slate' | 'red';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-100 text-brand-700',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-800',
  slate: 'bg-slate-100 text-slate-700',
  red: 'bg-red-100 text-red-700',
};

export function Badge({
  tone = 'brand',
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
