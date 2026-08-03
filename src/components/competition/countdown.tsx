'use client';

import { useEffect, useState } from 'react';

function diff(target: number) {
  const now = Date.now();
  const delta = Math.max(0, target - now);
  return {
    days: Math.floor(delta / 86400000),
    hours: Math.floor((delta / 3600000) % 24),
    minutes: Math.floor((delta / 60000) % 60),
    seconds: Math.floor((delta / 1000) % 60),
    ended: delta === 0,
  };
}

export function Countdown({
  to,
  compact = false,
}: {
  to: string | Date;
  compact?: boolean;
}) {
  const target = new Date(to).getTime();
  const [time, setTime] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (time.ended) {
    return <span className="text-sm font-semibold text-red-600">Closed</span>;
  }

  const units = [
    { label: 'd', value: time.days },
    { label: 'h', value: time.hours },
    { label: 'm', value: time.minutes },
    { label: 's', value: time.seconds },
  ];

  if (compact) {
    return (
      <span className="tabular-nums font-semibold text-ink">
        {time.days > 0 && `${time.days}d `}
        {String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:
        {String(time.seconds).padStart(2, '0')}
      </span>
    );
  }

  return (
    <div className="flex gap-2" role="timer" aria-label="Time remaining">
      {units.map((u) => (
        <div
          key={u.label}
          className="flex min-w-[3rem] flex-col items-center rounded-xl bg-ink px-2 py-1.5 text-white"
        >
          <span className="text-lg font-bold tabular-nums leading-none">
            {String(u.value).padStart(2, '0')}
          </span>
          <span className="text-[10px] uppercase opacity-70">{u.label}</span>
        </div>
      ))}
    </div>
  );
}
