"use client";

import { useState, useMemo } from "react";

/**
 * Honest earnings estimator.
 *
 * Numbers are anchored against actual alt-data pricing for consumer
 * spend panels in 2026: roughly $0.15–$0.40 per verified transaction
 * for research buyers, depending on sender quality and freshness.
 * Rides trade lower than shopping. We split 80/20 in the user's favor.
 */
export function Estimator() {
  const [rides, setRides] = useState(12);
  const [delivery, setDelivery] = useState(18);
  const [shopping, setShopping] = useState(14);

  const monthly = useMemo(() => {
    const rideValue = rides * 0.18;
    const deliveryValue = delivery * 0.28;
    const shoppingValue = shopping * 0.35;
    const gross = rideValue + deliveryValue + shoppingValue;
    const yourCut = gross * 0.8;
    return yourCut;
  }, [rides, delivery, shopping]);

  const annual = monthly * 12;

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 backdrop-blur-sm p-8 md:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
        {/* Sliders */}
        <div className="space-y-8">
          <Slider
            label="Rides per month"
            sub="Uber, Lyft, Bolt"
            value={rides}
            min={0}
            max={60}
            onChange={setRides}
          />
          <Slider
            label="Delivery orders per month"
            sub="DoorDash, Uber Eats, Instacart"
            value={delivery}
            min={0}
            max={60}
            onChange={setDelivery}
          />
          <Slider
            label="Online orders per month"
            sub="Amazon, Walmart, Target, the rest"
            value={shopping}
            min={0}
            max={60}
            onChange={setShopping}
          />
        </div>

        {/* Output */}
        <div className="text-left lg:text-right">
          <div className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-ink-quiet)] mb-3">
            your cut · 80/20 split
          </div>
          <div className="font-display text-[96px] sm:text-[128px] leading-[0.9] text-[var(--color-amber)]">
            ${monthly.toFixed(0)}
          </div>
          <div className="font-mono text-sm text-[var(--color-ink-muted)] mt-2">
            /month
          </div>
          <div className="mt-6 pt-6 border-t border-[var(--color-border-subtle)] text-[var(--color-ink-2)]">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-quiet)]">
              annually
            </span>
            <div className="text-[28px] font-display mt-1">
              ${annual.toFixed(0)}
            </div>
          </div>
          <div className="text-[12px] text-[var(--color-ink-quiet)] mt-6 max-w-sm lg:ml-auto leading-relaxed">
            Benchmarked against 2026 alt-data pricing. Payouts start when V1
            ships. Numbers are honest, not marketing.
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  sub,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sub: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="text-[var(--color-ink)] font-medium">{label}</div>
          <div className="font-mono text-[11px] text-[var(--color-ink-quiet)] mt-0.5">
            {sub}
          </div>
        </div>
        <div className="font-display text-[32px] text-[var(--color-ink)] tabular-nums">
          {value}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        aria-label={label}
      />
    </div>
  );
}
