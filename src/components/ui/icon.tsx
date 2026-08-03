import { cn } from '@/lib/utils';

/**
 * Material Symbols (Outlined) icon. Pass the icon's ligature name, e.g.
 * <Icon name="local_shipping" />. The font is loaded once in the root layout.
 */
export function Icon({
  name,
  filled = false,
  className,
}: {
  name: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn('material-symbols-outlined select-none leading-none', filled && 'ms-fill', className)}
    >
      {name}
    </span>
  );
}

const MATERIAL_NAME = /^[a-z][a-z0-9_]*$/;

/**
 * Render a CMS-provided icon value: if it looks like a Material Symbols name
 * (lowercase letters/underscores) it renders as an icon; otherwise the raw
 * value is shown as-is (e.g. an emoji). Lets admins use either.
 */
export function CmsIcon({ value, className }: { value: string; className?: string }) {
  const trimmed = value.trim();
  if (MATERIAL_NAME.test(trimmed)) {
    return <Icon name={trimmed} className={className} />;
  }
  return <span className={cn('leading-none', className)}>{trimmed}</span>;
}
