"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { NetworkPanel } from "@/components/NetworkPanel";
import { ProofAnimation } from "@/components/ProofAnimation";
import { OAuthDismissedError } from "@/lib/google-auth";
import { manualGmailAuth } from "@/lib/google-auth-manual";
import { listMessages, fetchRawMessage, extractPreview } from "@/lib/gmail";
import { proveEmail, type ProofResult } from "@/lib/prover";

// wryonik/OrderTotal@v1 — "Grubhub Order Total". The ONLY production-ready
// blueprint in the entire zk.email registry that extracts a dollar amount
// from a real US food delivery merchant. Authored by a zk.email maintainer.
// Status: client+server done. Has an on-chain verifier deployed on Base
// Sepolia (0xCa7FCebee2c71cB9b014dF41Ae6Ba8dBD8d942c1).
//
// The body regex (<b>\$)([^<]+)< parses the literal "<b>$XX.XX</b>" tag in
// Grubhub receipt emails. Uses sha_precompute_selector: "Total charge" so
// the prover only hashes the body chunk after that string, making the
// proof small and fast (email_body_max_length: 6144).
//
// No external inputs required.
const BLUEPRINT_SLUG = "wryonik/OrderTotal@v1";
const GMAIL_QUERY = 'from:eat.grubhub.com "thanks for your"';

const EXTERNAL_INPUTS: Array<{ name: string; value: string; maxLength: number }> =
  [];

type EmailCandidate = {
  id: string;
  rawEml: string;
  subject: string;
  from: string;
  date: string;
};

type ConnectState =
  | { phase: "idle"; hint?: string }
  | { phase: "auth" }
  | { phase: "fetching"; step: string }
  | { phase: "picking"; candidates: EmailCandidate[] }
  | { phase: "proving"; startedAt: number; subject: string }
  | { phase: "uploading" }
  | { phase: "done"; result: ProofResult; receivedId: string }
  | { phase: "error"; message: string };

export default function ConnectPage() {
  const [state, setState] = useState<ConnectState>({ phase: "idle" });

  async function startFlow() {
    // Open the OAuth popup synchronously inside the click handler so the
    // user gesture is preserved. manualGmailAuth uses our own /oauth/callback
    // page + postMessage instead of GIS, which has been unreliable for us.
    let tokenPromise: Promise<string>;
    try {
      tokenPromise = manualGmailAuth();
    } catch (err) {
      setState({
        phase: "error",
        message: err instanceof Error ? err.message : "Failed to start auth",
      });
      return;
    }
    setState({ phase: "auth" });

    try {
      let token: string;
      try {
        token = await tokenPromise;
      } catch (err) {
        if (err instanceof OAuthDismissedError) {
          setState({
            phase: "idle",
            hint: err.message ||
              "Sign-in was cancelled. Click Connect again — and if you don't see the popup, allow popups for this site in your browser.",
          });
          return;
        }
        throw err;
      }

      setState({ phase: "fetching", step: "Searching your inbox..." });
      const messages = await listMessages(token, GMAIL_QUERY, 20);
      if (messages.length === 0) {
        setState({
          phase: "error",
          message:
            'No Uber receipts found. Try the Gmail search "from:uber.com" in your inbox to confirm there are matching emails.',
        });
        return;
      }

      setState({
        phase: "fetching",
        step: `Fetching ${messages.length} receipt${messages.length > 1 ? "s" : ""} from Gmail...`,
      });

      const candidates: EmailCandidate[] = [];
      for (const m of messages) {
        const { rawEml } = await fetchRawMessage(token, m.id);
        const { subject, from, date } = extractPreview(rawEml);
        candidates.push({ id: m.id, rawEml, subject, from, date });
      }

      setState({ phase: "picking", candidates });
    } catch (err) {
      setState({
        phase: "error",
        message: err instanceof Error ? err.message : "Something broke",
      });
    }
  }

  async function prove(candidate: EmailCandidate) {
    try {
      setState({
        phase: "proving",
        startedAt: Date.now(),
        subject: candidate.subject,
      });
      const result = await proveEmail(
        BLUEPRINT_SLUG,
        candidate.rawEml,
        EXTERNAL_INPUTS
      );

      setState({ phase: "uploading" });
      const res = await fetch("/api/proofs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blueprint: result.blueprintSlug,
          proof: result.proofJson,
          publicData: result.publicData,
          durationMs: result.durationMs,
        }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Upload failed (${res.status}): ${txt.slice(0, 200)}`);
      }
      const upload = (await res.json()) as { id: string };
      setState({ phase: "done", result, receivedId: upload.id });
    } catch (err) {
      console.error("[redactable/prove] failed:", err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : JSON.stringify(err);
      setState({ phase: "error", message });
    }
  }

  return (
    <main className="flex-1">
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-[var(--color-canvas)]/70 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <Link
            href="/"
            className="text-[14px] text-[var(--color-ink-2)] hover:text-[var(--color-ink)] transition"
          >
            ← Back
          </Link>
        </div>
      </nav>

      <div className="max-w-[1280px] mx-auto px-6 pt-20 pb-32 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 items-start">
        {/* Left: flow */}
        <div className="animate-fade-up">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-6">
            V0 · Proof flow · Grubhub order totals
          </div>
          <h1 className="font-display text-[56px] sm:text-[72px] leading-[0.95] tracking-[-0.02em] text-[var(--color-ink)]">
            Prove one in
            <br />
            your browser.
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.6] text-[var(--color-ink-muted)]">
            Click connect. Google will ask if it&apos;s OK to give your
            receipts to this tab. It will. Your tab runs the math. We hear
            nothing until the finished proof ships.
          </p>

          <div className="mt-12">
            {state.phase === "idle" && (
              <IdleCard onStart={startFlow} hint={state.hint} />
            )}
            {state.phase === "auth" && (
              <StatusCard
                title="Waiting on Google..."
                body="A popup should have opened. If it didn't, check your browser's popup blocker and try again."
              />
            )}
            {state.phase === "fetching" && (
              <StatusCard title="Fetching receipts" body={state.step} />
            )}
            {state.phase === "picking" && (
              <PickerCard candidates={state.candidates} onPick={prove} />
            )}
            {state.phase === "proving" && (
              <ProofAnimation
                startedAt={state.startedAt}
                subject={state.subject}
              />
            )}
            {state.phase === "uploading" && (
              <StatusCard
                title="Uploading the proof"
                body="This is the first and only request our server receives."
              />
            )}
            {state.phase === "done" && (
              <DoneCard result={state.result} id={state.receivedId} />
            )}
            {state.phase === "error" && (
              <ErrorCard
                message={state.message}
                onReset={() => setState({ phase: "idle" })}
              />
            )}
          </div>
        </div>

        {/* Right: network panel — watch it live */}
        <div className="animate-fade-up lg:sticky lg:top-24" style={{ animationDelay: "0.15s" }}>
          <NetworkPanel />
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-[var(--color-ink-quiet)]">
            Watch this panel while the flow runs. Every request to
            googleapis.com comes from YOUR browser — our server is not
            there. redactable.xyz stays at 0 B until the last step.
          </p>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   STATE CARDS
   ============================================================ */

function IdleCard({
  onStart,
  hint,
}: {
  onStart: () => void;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white/[0.02] p-8">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-quiet)] mb-3">
        Step 00 · Ready
      </div>
      <div className="font-display text-[28px] text-[var(--color-ink)] mb-4">
        Connect your Gmail.
      </div>
      <p className="text-[14px] text-[var(--color-ink-muted)] mb-6 leading-relaxed">
        We&apos;ll request read-only access to your Gmail. We&apos;re
        searching for{" "}
        <span className="font-mono text-[var(--color-amber)]">
          from:eat.grubhub.com &quot;thanks for your&quot;
        </span>
        {" "}— Grubhub order confirmation receipts. The proof will extract
        the actual dollar total from the receipt body without revealing
        anything else.
      </p>
      {hint && (
        <div className="mb-6 rounded-sm border border-[var(--color-amber)] bg-[var(--color-amber-muted)] px-4 py-3 text-[13px] text-[var(--color-ink-2)]">
          {hint}
        </div>
      )}
      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-amber)] hover:bg-[var(--color-amber-hover)] text-black px-5 py-3 text-[15px] font-medium transition"
      >
        Connect Gmail
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}

function StatusCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white/[0.02] p-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-amber)] animate-pulse-dot" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-quiet)]">
          Working
        </span>
      </div>
      <div className="font-display text-[28px] text-[var(--color-ink)] mb-3">
        {title}
      </div>
      <p className="text-[14px] text-[var(--color-ink-muted)]">{body}</p>
    </div>
  );
}

function PickerCard({
  candidates,
  onPick,
}: {
  candidates: EmailCandidate[];
  onPick: (c: EmailCandidate) => void;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white/[0.02] p-8">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-quiet)] mb-3">
        Step 02 · Pick one
      </div>
      <div className="font-display text-[28px] text-[var(--color-ink)] mb-4">
        {candidates.length} receipt{candidates.length > 1 ? "s" : ""} found.
      </div>
      <p className="text-[14px] text-[var(--color-ink-muted)] mb-6">
        Click one to generate a zero-knowledge proof of it. Takes 60–180
        seconds in this tab. Your browser will feel slow during the math.
      </p>
      <ul className="space-y-2">
        {candidates.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => onPick(c)}
              className="w-full text-left rounded-sm border border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/60 hover:border-[var(--color-amber)] hover:bg-white/[0.04] transition p-4 group"
            >
              <div className="text-[14px] text-[var(--color-ink)] group-hover:text-[var(--color-amber)] transition line-clamp-1 mb-1">
                {c.subject}
              </div>
              <div className="font-mono text-[11px] text-[var(--color-ink-quiet)]">
                {c.from} · {c.date}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DoneCard({ result, id }: { result: ProofResult; id: string }) {
  const durationSec = (result.durationMs / 1000).toFixed(1);

  return (
    <div className="rounded-lg border border-[var(--color-ok)] bg-[rgba(16,185,129,0.08)] p-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-ok)]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ok)]">
          Done · Proof generated and uploaded
        </span>
      </div>
      <div className="font-display text-[40px] text-[var(--color-ink)] mb-2">
        You just proved it.
      </div>
      <p className="text-[14px] text-[var(--color-ink-muted)] mb-6">
        {durationSec}s of local compute. Proof bundle uploaded. Our server
        received the finished math — nothing else.
      </p>
      <div className="rounded-sm bg-[var(--color-canvas)] border border-[var(--color-border-subtle)] p-4 mb-6">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-quiet)] mb-2">
          Server receipt
        </div>
        <div className="font-mono text-[12px] text-[var(--color-ink-2)]">
          id: {id}
        </div>
        <div className="font-mono text-[12px] text-[var(--color-ink-2)]">
          blueprint: {result.blueprintSlug}
        </div>
      </div>
      <details className="mb-4">
        <summary className="font-mono text-[12px] text-[var(--color-amber)] cursor-pointer hover:text-[var(--color-amber-hover)]">
          Show the proof JSON
        </summary>
        <pre className="mt-3 rounded-sm bg-[var(--color-canvas)] border border-[var(--color-border-subtle)] p-4 font-mono text-[11px] leading-relaxed text-[var(--color-ink-2)] overflow-x-auto max-h-80">
          {JSON.stringify(result.proofJson, null, 2)}
        </pre>
      </details>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-sm border border-[var(--color-border)] bg-white/[0.02] hover:bg-white/[0.06] text-[var(--color-ink-2)] px-5 py-3 text-[14px] transition"
      >
        Back to home
      </Link>
    </div>
  );
}

function ErrorCard({
  message,
  onReset,
}: {
  message: string;
  onReset: () => void;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-danger)] bg-[rgba(248,113,113,0.06)] p-8">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-danger)] mb-3">
        Error
      </div>
      <div className="font-display text-[24px] text-[var(--color-ink)] mb-3">
        Something broke.
      </div>
      <p className="text-[14px] text-[var(--color-ink-2)] mb-6 font-mono break-all">
        {message}
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-amber)] hover:bg-[var(--color-amber-hover)] text-black px-5 py-3 text-[14px] font-medium transition"
      >
        Try again
      </button>
    </div>
  );
}
