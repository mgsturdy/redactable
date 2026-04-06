"use client";

/**
 * The Redactable wordmark.
 *
 * On mount, a black redaction bar sweeps across "edacta" and settles,
 * leaving "R▇▇▇▇▇▇ble" — the brand is literally the act of redacting.
 */
export function Logo({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-6xl sm:text-7xl md:text-8xl",
  } as const;

  return (
    <span
      className={`relative inline-flex items-baseline font-sans font-medium tracking-tight text-ink ${sizes[size]} ${className}`}
      style={{ fontVariationSettings: "'wght' 510" }}
      aria-label="Redactable"
    >
      <span aria-hidden="true" className="relative inline-block">
        R
        <span className="relative inline-block">
          edacta
          {/* The black bar */}
          <span
            aria-hidden="true"
            className="absolute inset-y-[0.08em] -inset-x-[0.04em] bg-redact"
            style={{
              animation: "redact-sweep 1.2s var(--ease-out-expo) 0.3s both",
            }}
          />
        </span>
        ble
      </span>
    </span>
  );
}
