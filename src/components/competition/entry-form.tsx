'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatMoney } from '@/lib/utils';

interface Props {
  competitionId: string;
  ticketPrice: number;
  maxEntries: number;
  entriesSold: number;
  maxPerUser?: number | null;
  skillQuestion?: string | null;
  answerOptions: string[];
  isAuthenticated: boolean;
  isOpen: boolean;
}

const QUICK_PICKS = [1, 5, 10, 25];

export function EntryForm({
  competitionId,
  ticketPrice,
  maxEntries,
  entriesSold,
  maxPerUser,
  skillQuestion,
  answerOptions,
  isAuthenticated,
  isOpen,
}: Props) {
  const router = useRouter();
  const remaining = Math.max(0, maxEntries - entriesSold);
  const cap = Math.min(remaining, maxPerUser ?? remaining, 1000) || 1;

  const [quantity, setQuantity] = useState(1);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = quantity * ticketPrice;
  const total = Math.max(0, subtotal - discount);
  const clamp = (n: number) => Math.max(1, Math.min(cap, n));

  async function fetchQuote(code: string, qty: number) {
    setCouponLoading(true);
    try {
      const res = await fetch('/api/checkout/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitionId, quantity: qty, couponCode: code }),
      });
      const data = await res.json();
      setDiscount(data.discount || 0);
      setCouponMessage(data.couponMessage ?? null);
      setAppliedCode(data.couponApplied ? code.toUpperCase() : null);
    } catch {
      setCouponMessage('Could not apply code right now.');
    } finally {
      setCouponLoading(false);
    }
  }

  function applyCoupon() {
    if (!couponInput.trim()) return;
    fetchQuote(couponInput.trim(), quantity);
  }

  function updateQuantity(next: number) {
    const q = clamp(next);
    setQuantity(q);
    if (appliedCode) fetchQuote(appliedCode, q); // keep discount accurate
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (skillQuestion && !answer) {
      setError('Please answer the skill question to enter.');
      return;
    }

    if (!isAuthenticated) {
      const next = encodeURIComponent(window.location.pathname);
      router.push(`/login?next=${next}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitionId, quantity, answer, couponCode: appliedCode ?? undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
      // Redirect to Stripe Checkout (or dev fallback confirmation page).
      window.location.href = data.url;
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <div className="card p-6 text-center">
        <p className="font-semibold text-ink">This competition is now closed.</p>
        <p className="mt-1 text-sm text-ink/60">Check out our other live competitions.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-ink/60">Price per entry</span>
        <span className="text-2xl font-bold text-brand-600">{formatMoney(ticketPrice)}</span>
      </div>

      {skillQuestion && (
        <fieldset className="space-y-2">
          <legend className="label">Skill question: {skillQuestion}</legend>
          {answerOptions.map((opt) => (
            <label
              key={opt}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition ${
                answer === opt ? 'border-brand-400 bg-brand-50' : 'border-black/10 hover:bg-black/[0.02]'
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={opt}
                checked={answer === opt}
                onChange={(e) => setAnswer(e.target.value)}
                className="accent-brand-600"
              />
              {opt}
            </label>
          ))}
        </fieldset>
      )}

      <div>
        <label className="label" htmlFor="quantity">
          Number of entries
        </label>
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateQuantity(quantity - 1)}
            className="h-11 w-11 rounded-xl border border-black/10 text-xl font-bold hover:bg-black/5"
            aria-label="Decrease"
          >
            −
          </button>
          <input
            id="quantity"
            type="number"
            min={1}
            max={cap}
            value={quantity}
            onChange={(e) => updateQuantity(Number(e.target.value) || 1)}
            className="input h-11 w-24 text-center"
          />
          <button
            type="button"
            onClick={() => updateQuantity(quantity + 1)}
            className="h-11 w-11 rounded-xl border border-black/10 text-xl font-bold hover:bg-black/5"
            aria-label="Increase"
          >
            +
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_PICKS.filter((n) => n <= cap).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => updateQuantity(n)}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                quantity === n ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Discount code */}
      <div>
        <label className="label" htmlFor="coupon">
          Discount code
        </label>
        <div className="flex gap-2">
          <input
            id="coupon"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="input h-11 flex-1 uppercase"
          />
          <button
            type="button"
            onClick={applyCoupon}
            disabled={couponLoading || !couponInput.trim()}
            className="btn-secondary px-4 text-sm"
          >
            {couponLoading ? '…' : 'Apply'}
          </button>
        </div>
        {couponMessage && (
          <p className={`mt-1.5 text-xs ${appliedCode ? 'text-emerald-600' : 'text-amber-600'}`}>
            {couponMessage}
          </p>
        )}
      </div>

      <div className="space-y-1 border-t border-black/5 pt-4">
        {discount > 0 && (
          <>
            <div className="flex items-baseline justify-between text-sm text-ink/60">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex items-baseline justify-between text-sm text-emerald-600">
              <span>Discount {appliedCode ? `(${appliedCode})` : ''}</span>
              <span>−{formatMoney(discount)}</span>
            </div>
          </>
        )}
        <div className="flex items-baseline justify-between">
          <span className="font-medium">Total</span>
          <span className="text-2xl font-bold">{formatMoney(total)}</span>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
        {loading ? 'Preparing checkout…' : isAuthenticated ? 'Buy entries' : 'Log in to enter'}
      </button>

      <p className="text-center text-xs text-ink/50">
        Secure checkout with Stripe · {remaining.toLocaleString()} entries remaining
      </p>

      <p className="text-center text-xs text-ink/60">
        No purchase necessary —{' '}
        <a href="/free-entry" className="font-semibold text-brand-700 hover:underline">
          enter free by post
        </a>
      </p>
    </form>
  );
}
