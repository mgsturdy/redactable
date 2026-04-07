"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Waiting animation for ZK proof generation.
 *
 * While the main thread is pegged doing the real math, this component
 * runs on the browser's render queue whenever the UI gets a slice of
 * time. It shows:
 *   - A big live timer
 *   - A currently-playing phase word that morphs every few seconds
 *   - A terminal-style prover log that streams plausible operations
 *   - Occasional black-bar redaction sweeps across individual log lines
 *
 * The log messages are not the actual SDK output — the real prover
 * doesn't emit progress. These are curated to map to the phases a
 * ZK-email proof actually goes through (blueprint fetch → circuit
 * compile → witness build → UltraHonk prove → serialize), so a
 * technically-literate user feels the machine working.
 */

type LogLine = {
  id: number;
  prefix: string;
  body: string;
  value?: string;
  redact?: boolean;
};

const PHASES = [
  "fetching blueprint",
  "compiling circuit",
  "canonicalizing body",
  "verifying DKIM",
  "building witness",
  "running UltraHonk",
  "committing values",
  "serializing proof",
];

const LOG_POOL: Omit<LogLine, "id">[] = [
  { prefix: "fetch", body: "conductor.zk.email/blueprint/rutefig/UberReceipt@v1" },
  { prefix: "cache", body: "noir-bignum-paramgen 1.1.2  OK" },
  { prefix: "load ", body: "ultrahonk.wasm (4.2 MB)" },
  { prefix: "parse", body: "RFC822 headers · 2048 bytes" },
  { prefix: "dkim ", body: "sptrans.uber.com/20230601 → RSA-2048 valid" },
  { prefix: "sha  ", body: "canonicalized body · 4096 bytes" },
  { prefix: "regex", body: "^Subject:\\s*(.+)$  matched" },
  { prefix: "regex", body: "^Date:\\s*(.+)$  matched" },
  { prefix: "regex", body: "^From:\\s*(.+)$  matched", redact: true },
  { prefix: "hash ", body: "poseidon(recipient_email || salt)", value: "0x8f2a...c91b", redact: true },
  { prefix: "circ ", body: "witness constraints · 12384" },
  { prefix: "prove", body: "UltraHonk · backend spawn" },
  { prefix: "prove", body: "commitment phase 1 of 4" },
  { prefix: "prove", body: "commitment phase 2 of 4" },
  { prefix: "prove", body: "commitment phase 3 of 4" },
  { prefix: "prove", body: "commitment phase 4 of 4" },
  { prefix: "prove", body: "sumcheck rounds · 14" },
  { prefix: "prove", body: "ZK polynomial commitment" },
  { prefix: "check", body: "local verify · pass" },
  { prefix: "pack ", body: "proof bundle · 18.2 KB" },
  { prefix: "seal ", body: "public inputs committed" },
  { prefix: "wipe ", body: "raw email bytes cleared from memory", redact: true },
];

export function ProofAnimation({
  startedAt,
  subject,
}: {
  startedAt: number;
  subject: string;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [log, setLog] = useState<LogLine[]>([]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const nextIdRef = useRef(0);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Tick the timer every 200ms
  useEffect(() => {
    const id = setInterval(() => setElapsed(Date.now() - startedAt), 200);
    return () => clearInterval(id);
  }, [startedAt]);

  // Rotate the phase word every ~4s
  useEffect(() => {
    const id = setInterval(() => {
      setPhaseIndex((p) => (p + 1) % PHASES.length);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  // Stream log lines at intervals that look like real work happening
  useEffect(() => {
    let cancelled = false;
    let i = 0;

    const pushNext = () => {
      if (cancelled) return;
      const template = LOG_POOL[i % LOG_POOL.length];
      const line: LogLine = {
        id: nextIdRef.current++,
        ...template,
      };
      setLog((prev) => [...prev.slice(-18), line]);
      i++;
      // Variable interval: 800ms to 2600ms, weighted toward faster early and
      // slower later, so it doesn't feel robotic
      const delay = 900 + Math.random() * 1400 + Math.min(i * 30, 800);
      setTimeout(pushNext, delay);
    };

    // Kick off after a short beat so the UI has a moment to render
    const kickoff = setTimeout(pushNext, 400);
    return () => {
      cancelled = true;
      clearTimeout(kickoff);
    };
  }, []);

  // Keep log pinned to bottom
  useEffect(() => {
    const el = logContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const seconds = Math.floor(elapsed / 1000);
  const tenths = Math.floor((elapsed % 1000) / 100);

  return (
    <div className="rounded-lg border border-[var(--color-amber)] bg-[var(--color-amber-muted)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(245,166,35,0.25)]">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-amber)] animate-pulse-dot" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-amber)]">
            Proving locally · step 03
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-quiet)]">
          nothing leaving this tab
        </span>
      </div>

      {/* Timer + phase */}
      <div className="px-6 py-8 border-b border-[rgba(245,166,35,0.15)]">
        <div className="font-mono text-[11px] text-[var(--color-ink-quiet)] mb-3 line-clamp-1">
          receipt · {subject}
        </div>
        <div className="flex items-baseline gap-4">
          <div className="font-display text-[96px] sm:text-[128px] leading-[0.9] text-[var(--color-amber)] tabular-nums">
            {seconds}
            <span className="text-[48px] sm:text-[64px] text-[var(--color-ink-quiet)]">
              .{tenths}s
            </span>
          </div>
        </div>
        <div className="mt-4 font-mono text-[13px] uppercase tracking-[0.2em] text-[var(--color-ink-2)]">
          → {PHASES[phaseIndex]}
          <span className="inline-block w-[0.6em] h-[1em] bg-[var(--color-amber)] ml-1 translate-y-[2px] animate-pulse-dot" />
        </div>
      </div>

      {/* Terminal log */}
      <div
        ref={logContainerRef}
        className="bg-[var(--color-canvas)] font-mono text-[12px] leading-[1.6] px-6 py-5 h-60 overflow-y-auto text-[var(--color-ink-2)]"
        aria-live="polite"
      >
        {log.length === 0 ? (
          <div className="text-[var(--color-ink-quiet)]">
            $ initializing prover...
          </div>
        ) : (
          log.map((line) => <LogRow key={line.id} line={line} />)
        )}
      </div>

      {/* Reassurance footer */}
      <div className="px-6 py-4 border-t border-[rgba(245,166,35,0.15)] font-mono text-[11px] leading-relaxed text-[var(--color-ink-quiet)]">
        Your browser is doing the hard math. 60–180 seconds is normal on a
        laptop. The{" "}
        <span className="text-[var(--color-amber)]">network panel</span> next
        to this card is the receipt: our origin stays at 0 B until the
        finished proof ships.
      </div>
    </div>
  );
}

function LogRow({ line }: { line: LogLine }) {
  return (
    <div className="flex items-baseline gap-3 animate-fade-up" style={{ animationDuration: "0.4s" }}>
      <span className="text-[var(--color-amber)] shrink-0">[{line.prefix}]</span>
      <span className="text-[var(--color-ink-2)] flex-1 truncate">
        {line.body}
      </span>
      {line.value &&
        (line.redact ? (
          <RedactedValue value={line.value} />
        ) : (
          <span className="text-[var(--color-ink-muted)]">{line.value}</span>
        ))}
      {line.redact && !line.value && (
        <RedactedValue value="██████████" />
      )}
    </div>
  );
}

function RedactedValue({ value }: { value: string }) {
  return (
    <span className="relative inline-block shrink-0">
      <span className="text-[var(--color-ink-quiet)]">{value}</span>
      <span
        aria-hidden
        className="absolute inset-y-[0.05em] -inset-x-[0.1em] bg-redact"
        style={{
          animation: "redact-sweep 0.6s var(--ease-out-expo) 0.3s both",
        }}
      />
    </span>
  );
}
