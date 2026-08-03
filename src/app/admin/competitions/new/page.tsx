import { prisma } from '@/lib/prisma';
import { saveCompetitionAction } from '@/lib/actions/admin';
import { CompetitionForm } from '@/components/admin/competition-form';
import { AdminPageHeader } from '@/components/admin/ui';
import { toInputDateTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function NewCompetitionPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const action = saveCompetitionAction.bind(null, null);

  const weekAhead = new Date();
  weekAhead.setDate(weekAhead.getDate() + 7);

  return (
    <div>
      <AdminPageHeader title="New competition" description="Add a new prize competition." />
      <CompetitionForm
        action={action}
        categories={categories}
        values={{
          title: '',
          subtitle: '',
          slug: '',
          description: '',
          terms: '',
          heroImage: '',
          retailValue: 0,
          ticketPrice: 0,
          maxEntries: 1000,
          maxPerUser: '',
          drawDate: toInputDateTime(weekAhead),
          closingDate: toInputDateTime(weekAhead),
          skillQuestion: '',
          answerOptions: '',
          correctAnswer: '',
          status: 'DRAFT',
          featured: false,
          metaTitle: '',
          metaDescription: '',
          categoryId: '',
        }}
      />
    </div>
  );
}
