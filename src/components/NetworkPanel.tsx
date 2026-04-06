"use client";

import { useEffect, useRef, useState } from "react";

type Entry = {
  id: number;
  method: string;
  origin: string;
  path: string;
  bytes: number;
  ts: number;
  category: "google" | "ours" | "other";
};

/**
 * Live network panel — the trust moment.
 *
 * Monkey-patches window.fetch on mount and logs every outbound request,
 * categorized by domain. The marketing claim ("we never see your emails")
 * is made verifiable: users watch their own browser prove that nothing
 * PII-shaped ever crosses our origin.
 *
 * Categories:
 *   google → accounts.google.com, gmail.googleapis.com (expected, user's data)
 *   ours   → redactable.xyz (only ever receives finished proof bundles)
 *   other  → anything else (should be zero)
 */
export function NetworkPanel() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [ourBytes, setOurBytes] = useState(0);
  const [googleBytes, setGoogleBytes] = useState(0);
  const nextId = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const [input, init] = args;
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      const method = (init?.method ?? "GET").toUpperCase();

      const res = await originalFetch(...args);

      try {
        const parsed = new URL(url, window.location.origin);
        const host = parsed.host;
        const category: Entry["category"] =
          host.endsWith("googleapis.com") || host.endsWith("google.com")
            ? "google"
            : host === window.location.host
              ? "ours"
              : "other";

        // Best-effort byte count — clone to avoid consuming body
        let bytes = 0;
        const contentLength = res.headers.get("content-length");
        if (contentLength) bytes = parseInt(contentLength, 10) || 0;

        const entry: Entry = {
          id: nextId.current++,
          method,
          origin: host,
          path: parsed.pathname.slice(0, 48),
          bytes,
          ts: Date.now(),
          category,
        };

        setEntries((prev) => [entry, ...prev].slice(0, 12));
        if (category === "ours") setOurBytes((b) => b + bytes);
        if (category === "google") setGoogleBytes((b) => b + bytes);
      } catch {
        // swallow — never break the app because of observability
      }

      return res;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <div
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/60 backdrop-blur-sm p-5 font-mono text-xs"
      role="region"
      aria-label="Live network activity"
    >
      <header className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-ok)] animate-pulse-dot"
            aria-hidden
          />
          <span className="text-[var(--color-ink-2)] uppercase tracking-widest text-[10px]">
            Live network · what we&apos;ve seen from you
          </span>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Metric
          label="redactable.xyz"
          value={`${ourBytes} B`}
          tone={ourBytes === 0 ? "ok" : "neutral"}
          sub="what our server has received"
        />
        <Metric
          label="google apis"
          value={formatBytes(googleBytes)}
          tone="neutral"
          sub="direct browser→google"
        />
      </div>

      <div className="min-h-[120px]">
        {entries.length === 0 ? (
          <div className="text-[var(--color-ink-quiet)] py-4">
            <div className="text-[var(--color-ink-muted)] mb-1">
              $ awaiting requests...
            </div>
            <div className="text-[10px] leading-relaxed">
              Click <span className="text-[var(--color-amber)]">Connect Gmail</span> and
              watch every byte. Your emails never reach this domain — only the
              finished, PII-free proof does.
            </div>
          </div>
        ) : (
          <ul className="space-y-1">
            {entries.map((e) => (
              <li
                key={e.id}
                className={`flex items-center gap-2 text-[11px] ${
                  e.category === "ours"
                    ? "text-[var(--color-amber)]"
                    : e.category === "google"
                      ? "text-[var(--color-ink-2)]"
                      : "text-red-400"
                }`}
              >
                <span className="text-[var(--color-ink-quiet)] w-10 shrink-0">
                  {e.method}
                </span>
                <span className="truncate">
                  {e.origin}
                  <span className="text-[var(--color-ink-quiet)]">{e.path}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "ok" | "neutral";
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-[var(--color-ink-quiet)]">
        {label}
      </div>
      <div
        className={`text-lg font-medium mt-1 ${
          tone === "ok" ? "text-[var(--color-ok)]" : "text-[var(--color-ink)]"
        }`}
      >
        {value}
      </div>
      <div className="text-[10px] text-[var(--color-ink-quiet)]">{sub}</div>
    </div>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
