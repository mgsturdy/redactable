import { Logo } from "@/components/Logo";
import { NetworkPanel } from "@/components/NetworkPanel";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Top nav */}
      <nav className="w-full border-b border-[var(--color-border-subtle)]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-5">
          <Logo size="md" />
          <div className="flex items-center gap-6 text-[13px] text-[var(--color-ink-2)]">
            <a href="#how" className="hover:text-[var(--color-ink)] transition">
              How it works
            </a>
            <a href="#buyers" className="hover:text-[var(--color-ink)] transition">
              For buyers
            </a>
            <a
              href="https://github.com/zkemail"
              className="hover:text-[var(--color-ink)] transition"
            >
              Open source
            </a>
            <a
              href="#connect"
              className="inline-flex items-center rounded-md bg-[var(--color-amber)] hover:bg-[var(--color-amber-hover)] text-black px-3 py-1.5 font-medium transition"
            >
              Connect Gmail
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-24 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
          {/* Left: headline */}
          <div className="animate-fade-up">
            {/* Preview badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-amber-muted)] px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[var(--color-amber)] mb-8">
              <span className="inline-block w-1 h-1 rounded-full bg-[var(--color-amber)] animate-pulse-dot" />
              Early preview · ride receipts only · dollar totals coming soon
            </div>

            <h1
              className="text-[56px] sm:text-[72px] leading-[1.0] tracking-[-0.02em] text-[var(--color-ink)]"
              style={{ fontVariationSettings: "'wght' 510" }}
            >
              Your inbox,
              <br />
              <Logo size="lg" className="inline-block" />.
            </h1>

            <p className="mt-8 max-w-xl text-[18px] leading-[1.6] text-[var(--color-ink-muted)]">
              Sell verified spend data from your email. We{" "}
              <span className="text-[var(--color-ink-2)]">
                architecturally cannot see a thing
              </span>
              . Zero-knowledge proofs of your receipts, generated on your own
              machine, bought by researchers who only ever receive the math.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#connect"
                className="inline-flex items-center gap-2 rounded-md bg-[var(--color-amber)] hover:bg-[var(--color-amber-hover)] text-black px-5 py-3 font-medium transition"
              >
                Connect Gmail
                <span aria-hidden>→</span>
              </a>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-white/[0.02] hover:bg-white/[0.04] text-[var(--color-ink-2)] px-5 py-3 transition"
              >
                See how it works
              </a>
            </div>

            <p className="mt-6 text-[12px] text-[var(--color-ink-quiet)] font-mono">
              USA only · Gmail &amp; Outlook · CCPA registered data broker
            </p>
          </div>

          {/* Right: live network panel — the trust moment */}
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <NetworkPanel />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-[var(--color-border-subtle)]" />

      {/* Placeholder: how it works / buyers / estimator / footer */}
      <section
        id="how"
        className="max-w-[1200px] mx-auto px-6 py-24 w-full"
      >
        <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-ink-quiet)] mb-4">
          01 · How it works
        </div>
        <h2
          className="text-[40px] leading-[1.05] tracking-[-0.015em] text-[var(--color-ink)] max-w-3xl"
          style={{ fontVariationSettings: "'wght' 510" }}
        >
          Four steps. Zero servers touching your email.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-lg border border-[var(--color-border)] bg-white/[0.02] p-6"
            >
              <div className="text-[11px] font-mono text-[var(--color-ink-quiet)] mb-3">
                0{i + 1}
              </div>
              <div
                className="text-[18px] text-[var(--color-ink)] mb-2"
                style={{ fontVariationSettings: "'wght' 590" }}
              >
                {step.title}
              </div>
              <div className="text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
                {step.body}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-subtle)] mt-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[12px] text-[var(--color-ink-quiet)] font-mono">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span>© 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[var(--color-ink-2)]">
              Privacy
            </a>
            <a href="#" className="hover:text-[var(--color-ink-2)]">
              CCPA registry
            </a>
            <a
              href="https://github.com"
              className="hover:text-[var(--color-ink-2)]"
            >
              Client source
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

const STEPS = [
  {
    title: "Connect",
    body: "Google OAuth runs in your browser. The token never touches our server. You can revoke any time.",
  },
  {
    title: "Fetch",
    body: "Your emails are pulled from Gmail directly into your browser's memory. Not ours.",
  },
  {
    title: "Prove",
    body: "A zero-knowledge proof is generated on your machine in a Web Worker. Receipt contents stay local.",
  },
  {
    title: "Sell",
    body: "Only the finished, PII-free proof is uploaded. Buyers receive verified data. You get paid.",
  },
];
