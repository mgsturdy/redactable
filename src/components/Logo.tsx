"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The Redactable wordmark.
 *
 * Phase 1 — Redaction bar sweep:
 *   On first page load, a pure-black bar sweeps across "edacta" and
 *   anchors right, leaving "R▇▇▇▇▇▇ble" visible for ~1.5s.
 *
 * Phase 2 — Glitch reveal:
 *   The bar retracts, revealing the full wordmark underneath, but with
 *   a scroll-responsive SVG displacement filter applied. At rest the
 *   letters look clean; as the user scrolls, the letters corrupt and
 *   jitter, the way redacted data "peeks through" when disturbed. The
 *   glitch intensity follows scroll velocity and eases back to calm.
 *
 * Both the nav logo and the hero logo read from the same global scroll
 * state so they glitch in sync.
 */

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "text-[22px]",
  md: "text-[28px]",
  lg: "text-[72px] sm:text-[96px] md:text-[128px] leading-[0.9]",
};

// Shared scroll state — one listener for the whole page.
let listenerInstalled = false;
let currentIntensity = 0;
const subscribers = new Set<(v: number) => void>();

function installScrollListener() {
  if (typeof window === "undefined" || listenerInstalled) return;
  listenerInstalled = true;

  let lastY = window.scrollY;
  let lastT = performance.now();
  let target = 0;
  let current = 0;
  let raf = 0;

  const onScroll = () => {
    const now = performance.now();
    const dy = Math.abs(window.scrollY - lastY);
    const dt = Math.max(16, now - lastT);
    const velocity = (dy / dt) * 16; // px per frame-equivalent
    target = Math.min(14, velocity * 0.9);
    lastY = window.scrollY;
    lastT = now;
    kick();
  };

  const tick = () => {
    // Ease toward target, then decay toward 0
    current += (target - current) * 0.18;
    target *= 0.92;
    if (current < 0.05 && target < 0.05) {
      current = 0;
      target = 0;
      currentIntensity = 0;
      subscribers.forEach((s) => s(0));
      raf = 0;
      return;
    }
    currentIntensity = current;
    subscribers.forEach((s) => s(current));
    raf = requestAnimationFrame(tick);
  };

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", () => {
    // Small ambient jitter on mouse move
    target = Math.max(target, 0.6);
    kick();
  }, { passive: true });
}

function useGlitchIntensity() {
  const [intensity, setIntensity] = useState(0);
  useEffect(() => {
    installScrollListener();
    const sub = (v: number) => setIntensity(v);
    subscribers.add(sub);
    setIntensity(currentIntensity);
    return () => {
      subscribers.delete(sub);
    };
  }, []);
  return intensity;
}

export function Logo({
  size = "md",
  className = "",
}: {
  size?: Size;
  className?: string;
}) {
  const glitch = useGlitchIntensity();
  const [revealed, setRevealed] = useState(false);
  const filterRef = useRef<SVGFEDisplacementMapElement>(null);

  // After the intro sweep completes, drop the bar and show the glitch text.
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // Imperatively update the displacement scale — avoids React re-renders on every scroll frame.
  useEffect(() => {
    if (!filterRef.current) return;
    filterRef.current.setAttribute("scale", String(glitch));
  }, [glitch]);

  // Unique filter id per logo instance so multiple Logos don't fight.
  const idRef = useRef(`glitch-${Math.random().toString(36).slice(2, 9)}`);
  const filterId = idRef.current;

  return (
    <span
      className={`relative inline-flex items-baseline font-display tracking-[-0.01em] text-[var(--color-ink)] ${SIZES[size]} ${className}`}
      aria-label="Redactable"
    >
      {/* Inline SVG filter defs — must be in-document to be referenced by CSS filter */}
      <svg
        width="0"
        height="0"
        className="absolute"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.9"
              numOctaves="2"
              seed="7"
              result="noise"
            >
              <animate
                attributeName="seed"
                from="0"
                to="100"
                dur="4s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              ref={filterRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <span
        aria-hidden="true"
        className="relative inline-block"
        style={{
          filter: revealed ? `url(#${filterId})` : undefined,
          transition: "filter 0.4s var(--ease-out-expo)",
        }}
      >
        R
        <span className="relative inline-block">
          edacta
          {/* The black bar — stays over the letters during phase 1, then retracts */}
          <span
            aria-hidden="true"
            className="absolute inset-y-[0.08em] -inset-x-[0.04em] bg-redact"
            style={{
              animation: `redact-sweep 1.2s var(--ease-out-expo) 0.3s both, redact-retract 0.5s var(--ease-out-expo) 1.5s forwards`,
            }}
          />
        </span>
        ble
      </span>
    </span>
  );
}
