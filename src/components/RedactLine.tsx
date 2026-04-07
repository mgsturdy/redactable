"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated redaction.
 *
 * Renders children in plain text, then once the element scrolls into view,
 * sweeps a black bar across it using the same `redact-sweep` keyframe the
 * logo uses. Set `delay` on consecutive items to cascade the effect — a
 * list of items will black out one after another, which reads as a
 * surveillance tape being censored in real time.
 */
export function RedactLine({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`relative inline-block align-baseline ${className}`}
    >
      <span className="text-[var(--color-ink-2)]">{children}</span>
      {visible && (
        <span
          aria-hidden
          className="absolute inset-y-[0.05em] -inset-x-[0.15em] bg-redact"
          style={{
            animation: `redact-sweep 0.9s var(--ease-out-expo) ${delay}ms both`,
          }}
        />
      )}
    </span>
  );
}
