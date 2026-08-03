import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { saveCompetitionAction } from '@/lib/actions/admin';
import { CompetitionForm } from '@/components/admin/competition-form';
import { AdminPageHeader } from '@/components/admin/ui';
import { toInputDateTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function EditCompetitionPage({ params }: { params: { id: string } }) {
  const [comp, categories] = await Promise.all([
    prisma.competition.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);
  if (!comp) notFound();

  const action = saveCompetitionAction.bind(null, comp.id);

  return (
    <div>
      <AdminPageHeader
        title="Edit competition"
        description={`${comp.entriesSold} of ${comp.maxEntries} entries sold.`}
      />
      <CompetitionForm
        action={action}
        categories={categories}
        values={{
          title: comp.title,
          subtitle: comp.subtitle ?? '',
          slug: comp.slug,
          description: comp.description,
          terms: comp.terms ?? '',
          heroImage: comp.heroImage ?? '',
          retailValue: comp.retailValue / 100,
          ticketPrice: comp.ticketPrice / 100,
          maxEntries: comp.maxEntries,
          maxPerUser: comp.maxPerUser ? String(comp.maxPerUser) : '',
          drawDate: toInputDateTime(comp.drawDate),
          closingDate: toInputDateTime(comp.closingDate),
          skillQuestion: comp.skillQuestion ?? '',
          answerOptions: comp.answerOptions.join('\n'),
          correctAnswer: comp.correctAnswer ?? '',
          status: comp.status,
          featured: comp.featured,
          metaTitle: comp.metaTitle ?? '',
          metaDescription: comp.metaDescription ?? '',
          categoryId: comp.categoryId ?? '',
        }}
      />
    </div>
  );
}
