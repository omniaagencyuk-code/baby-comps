const signals = [
  {
    icon: '🔒',
    title: 'Verifiable draws',
    text: 'Every draw is transparent, recorded and independently verifiable.',
  },
  {
    icon: '🚚',
    title: 'Free UK delivery',
    text: 'Prizes delivered securely to your door at no extra cost.',
  },
  {
    icon: '💳',
    title: 'Secure checkout',
    text: 'Safe, encrypted card payments powered by Stripe.',
  },
];

export function TrustSignals() {
  return (
    <div className="card p-6">
      <h3 className="mb-4 font-display text-lg font-semibold text-secondaryink">Why Tiny Treasure?</h3>
      <div className="space-y-4">
        {signals.map((s) => (
          <div key={s.title} className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-100 text-lg">
              {s.icon}
            </span>
            <div>
              <h4 className="text-sm font-semibold text-secondaryink">{s.title}</h4>
              <p className="text-sm text-muted">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
