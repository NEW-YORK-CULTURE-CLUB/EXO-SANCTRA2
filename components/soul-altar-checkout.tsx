'use client';

import { useCallback, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ALTAR_PRICES, formatUsd, type CheckoutProductType } from '@/app/omrak-collection/pricing';

const SOUL_ALTAR_PRODUCT_ID = 'soul-activation-art-altar';

const SIZE_OPTIONS = [
  { type: 'soul-altar-9x12' as const, label: '9×12 in' },
  { type: 'soul-altar-11x14' as const, label: '11×14 in' },
  { type: 'soul-altar-16x20' as const, label: '16×20 in' },
];

const SIZE_CENTS = [ALTAR_PRICES['9x12'], ALTAR_PRICES['11x14'], ALTAR_PRICES['16x20']];

type SoulAltarCheckoutProps = {
  variant?: 'dark' | 'glass';
  className?: string;
};

export function SoulAltarCheckout({ variant = 'glass', className = '' }: SoulAltarCheckoutProps) {
  const [loading, setLoading] = useState<CheckoutProductType | null>(null);

  const handleBuy = useCallback(async (type: CheckoutProductType) => {
    setLoading(type);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: SOUL_ALTAR_PRODUCT_ID,
          title: 'Soul Activation Art Altar',
          type,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
      }
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setLoading(null);
    }
  }, []);

  const btnBase =
    variant === 'dark'
      ? 'rounded-full border border-white/60 text-white px-4 py-2.5 text-sm font-semibold hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2 w-full'
      : 'rounded-full border border-white/30 bg-white/5 text-white px-4 py-2.5 text-sm font-semibold hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2 w-full';

  const primaryBtn =
    variant === 'dark'
      ? 'rounded-full bg-gradient-to-r from-white/80 to-white text-black px-4 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity inline-flex items-center justify-center gap-2 w-full'
      : btnBase;

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-sm text-white/70 text-center">
        Choose your altar size. After purchase, complete the Soul Questionnaire so Alina can channel your essence.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {SIZE_OPTIONS.map(({ type, label }, i) => (
          <button
            key={type}
            type="button"
            onClick={() => handleBuy(type)}
            disabled={loading !== null}
            className={i === 1 ? primaryBtn : btnBase}
          >
            {loading === type ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {label} — ${formatUsd(SIZE_CENTS[i])}
          </button>
        ))}
      </div>
    </div>
  );
}
