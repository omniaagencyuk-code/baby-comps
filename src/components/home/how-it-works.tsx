import type { IconItem } from '@/lib/content';

export function HowItWorks({ steps }: { steps: IconItem[] }) {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-white py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-600">
            Simple &amp; fair
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">How it works</h2>
        </div>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl bg-cream p-6 text-center">
              <span className="absolute right-4 top-4 text-sm font-bold text-brand-200">
                0{i + 1}
              </span>
              <div className="mb-3 text-4xl">{s.icon}</div>
              <h3 className="mb-1.5 font-semibold">{s.title}</h3>
              <p className="text-sm text-ink/60">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
