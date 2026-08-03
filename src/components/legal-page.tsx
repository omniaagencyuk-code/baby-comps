import { Breadcrumbs } from '@/components/breadcrumbs';

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-tight py-8">
      <Breadcrumbs items={[{ label: title }]} />
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: {updated}</p>
      <div className="prose-content mt-8 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1">
        {children}
      </div>
    </div>
  );
}
