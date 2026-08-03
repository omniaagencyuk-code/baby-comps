import { ButtonLink } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl">🧸</div>
      <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-ink/60">
        We couldn&apos;t find the treasure you were looking for. It may have been drawn already!
      </p>
      <div className="mt-6 flex gap-3">
        <ButtonLink href="/">Back home</ButtonLink>
        <ButtonLink href="/competitions" variant="secondary">
          Browse competitions
        </ButtonLink>
      </div>
    </div>
  );
}
