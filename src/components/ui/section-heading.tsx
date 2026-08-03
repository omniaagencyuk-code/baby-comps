import Link from 'next/link';

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-600">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold text-secondaryink sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-ink/70">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}
