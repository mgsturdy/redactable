import { Logo } from "@/components/Logo";
import { NetworkPanel } from "@/components/NetworkPanel";
import { RedactLine } from "@/components/RedactLine";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <Nav />
      <Hero />
      <Problem />
      <SeenVsNotSeen />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}

/* ============================================================
   NAV
   ============================================================ */
function Nav() {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-[var(--color-canvas)]/70 border-b border-[var(--color-border-subtle)]">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-4">
        <Logo size="sm" variant="reactive" />
        <div className="hidden md:flex items-center gap-8 text-[14px] text-[var(--color-ink-2)]">
          <a href="#problem" className="hover:text-[var(--color-ink)] transition">
            Why
          </a>
          <a href="#how" className="hover:text-[var(--color-ink)] transition">
            How
          </a>
          <a href="#pricing" className="hover:text-[var(--color-ink)] transition">
            Pricing
          </a>
          <a href="#faq" className="hover:text-[var(--color-ink)] transition">
            FAQ
          </a>
          <a
            href="https://github.com/mgsturdy/redactable"
            className="text-[var(--color-amber)] hover:text-[var(--color-amber-hover)] transition inline-flex items-center gap-1"
          >
            Source <span aria-hidden>↗</span>
          </a>
        </div>
        <a
          href="#access"
          className="inline-flex items-center rounded-sm bg-[var(--color-amber)] hover:bg-[var(--color-amber-hover)] text-black px-4 py-2 text-[14px] font-medium transition"
        >
          Request access →
        </a>
      </div>
    </nav>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero() {
  return (
    <section className="relative">
      <div className="max-w-[1280px] mx-auto px-6 pt-24 md:pt-32 pb-24 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-16 items-start">
        {/* Left */}
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-10">
            <span className="inline-block w-1 h-1 rounded-full bg-[var(--color-amber)] animate-pulse-dot" />
            V0 Beta · May 2026 · Income verification for landlords
          </div>

          <h1 className="font-display text-[64px] sm:text-[88px] md:text-[112px] leading-[0.9] tracking-[-0.02em] text-[var(--color-ink)]">
            Proof of
            <br />
            <span className="italic text-[var(--color-ink-2)]">income</span>.
            <br />
            No Plaid.
          </h1>

          <p className="mt-10 max-w-xl text-[19px] leading-[1.5] text-[var(--color-ink-muted)]">
            Send a link to your applicant. They sign into Gmail. Their browser
            reads one payroll email and hands you the verified numbers.{" "}
            <span className="text-[var(--color-ink-2)]">
              Employer. Gross. Pay date. Nothing else.
            </span>{" "}
            The paystub never leaves their machine. We never see it either.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#access"
              className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-amber)] hover:bg-[var(--color-amber-hover)] text-black px-6 py-3.5 text-[15px] font-medium transition"
            >
              Request access
              <span aria-hidden>→</span>
            </a>
            <a
              href="/connect"
              className="inline-flex items-center gap-2 rounded-sm border border-[var(--color-border)] bg-white/[0.02] hover:bg-white/[0.06] text-[var(--color-ink-2)] px-6 py-3.5 text-[15px] transition"
            >
              Watch the math run
            </a>
          </div>
          <p className="mt-4 font-mono text-[11px] text-[var(--color-ink-quiet)] max-w-md leading-relaxed">
            First 10 verifications free. $5 each after. No subscription, no
            seat fees, no setup.
          </p>

          <div className="mt-12 flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-quiet)]">
            <span>Gusto · Rippling · Justworks</span>
            <span>·</span>
            <span>ADP next</span>
          </div>
        </div>

        {/* Right — live network panel */}
        <div className="animate-fade-up lg:pt-8" style={{ animationDelay: "0.15s" }}>
          <NetworkPanel />
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-[var(--color-ink-quiet)]">
            Open DevTools. Watch the counter. Our server receives nothing
            until a finished proof ships. The browser enforces it.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PROBLEM — the three broken options
   ============================================================ */
function Problem() {
  return (
    <section id="problem" className="max-w-[1280px] mx-auto px-6 py-32 md:py-48">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-8">
        01 · The problem
      </div>
      <h2 className="font-display text-[44px] sm:text-[64px] md:text-[80px] leading-[0.95] tracking-[-0.015em] text-[var(--color-ink)] max-w-5xl">
        Every income check today is broken.
        <br />
        <span className="text-[var(--color-ink-muted)]">
          The applicant hates it.
        </span>
        <br />
        <span className="italic">You pay for it anyway.</span>
      </h2>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <BrokenCard
          tag="Option A"
          title="Plaid."
          body="You ask a stranger for their online banking login. Half of them bail before they finish. The ones who do hand over their entire financial life for one number. You paid $8 to $25 for the privilege."
          cost="$8 – $25"
          costLabel="per check"
        />
        <BrokenCard
          tag="Option B"
          title="PDF upload."
          body="The applicant drags a paystub into a form. It took thirty seconds to forge in Photoshop. You can't tell the difference. The fraud rate on self-reported income docs is 15% and climbing."
          cost="$0"
          costLabel="and forged in 30 seconds"
        />
        <BrokenCard
          tag="Option C"
          title="Background check."
          body="TransUnion SmartMove, Experian, RentPrep. They pull credit, they pull criminal records, they pull pet history. They still can't verify income without one of the above."
          cost="$30 – $45"
          costLabel="per applicant"
        />
      </div>

      <p className="mt-16 max-w-3xl text-[18px] text-[var(--color-ink-muted)] leading-relaxed">
        There is a fourth option.{" "}
        <span className="text-[var(--color-ink-2)]">
          The payroll provider already signs every paystub email with a
          cryptographic signature.
        </span>{" "}
        Gmail keeps a copy. The math has been sitting in your applicant&apos;s
        inbox the whole time. Nobody was reading it.
      </p>
    </section>
  );
}

function BrokenCard({
  tag,
  title,
  body,
  cost,
  costLabel,
}: {
  tag: string;
  title: string;
  body: string;
  cost: string;
  costLabel: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white/[0.02] p-8 flex flex-col">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-quiet)] mb-6">
        {tag}
      </div>
      <div className="font-display text-[40px] leading-none text-[var(--color-ink)] mb-5">
        {title}
      </div>
      <p className="text-[15px] leading-relaxed text-[var(--color-ink-muted)] mb-8 flex-1">
        {body}
      </p>
      <div className="pt-6 border-t border-[var(--color-border-subtle)]">
        <div className="font-display text-[28px] text-[var(--color-danger)]">
          {cost}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-quiet)] mt-1">
          {costLabel}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SEEN vs NOT SEEN — what the PM gets, what the applicant keeps
   ============================================================ */
function SeenVsNotSeen() {
  return (
    <section className="bg-[var(--color-panel)] border-y border-[var(--color-border-subtle)] py-32">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-8">
          02 · The payload
        </div>
        <h2 className="font-display text-[44px] sm:text-[64px] leading-[0.95] tracking-[-0.015em] text-[var(--color-ink)] max-w-4xl mb-16">
          What you receive.
          <br />
          <span className="text-[var(--color-ink-muted)] italic">
            And what you don&apos;t.
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stays private */}
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-danger)]" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-quiet)]">
                stays in their browser · you never see it
              </span>
            </div>
            <ul className="space-y-3 text-[15px]">
              {[
                "Bank account numbers",
                "Bank balance",
                "Other deposits",
                "Other employers",
                "Line-item tax withholdings",
                "Retirement contributions",
                "Health insurance deductions",
                "Social Security number",
                "Home address",
                "Every other email in their inbox",
              ].map((item, i) => (
                <li key={item}>
                  <RedactLine delay={150 + i * 120}>{item}</RedactLine>
                </li>
              ))}
            </ul>
          </div>

          {/* Ships in the proof — the valuable payload */}
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-ok)]" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-quiet)]">
                ships in the proof · what you get
              </span>
            </div>
            <pre className="font-mono text-[12px] leading-relaxed text-[var(--color-ink-2)] overflow-x-auto">
{`{
  `}<span className="text-[var(--color-amber)]">employer</span>{`:          "Acme Inc.",
  `}<span className="text-[var(--color-amber)]">payroll_provider</span>{`:  "gusto",
  `}<span className="text-[var(--color-amber)]">gross_cents</span>{`:       625000,
  `}<span className="text-[var(--color-amber)]">net_cents</span>{`:         478230,
  `}<span className="text-[var(--color-amber)]">pay_period</span>{`:        "2026-03-16/2026-03-31",
  `}<span className="text-[var(--color-amber)]">pay_date</span>{`:          "2026-04-01",
  `}<span className="text-[var(--color-amber)]">frequency</span>{`:         "semimonthly",
  `}<span className="text-[var(--color-amber)]">ytd_gross_cents</span>{`:   2812500,
  `}<span className="text-[var(--color-amber)]">dkim_domain</span>{`:       "gusto.com",
  `}<span className="text-[var(--color-amber)]">dkim_valid</span>{`:        true,
  `}<span className="text-[var(--color-amber)]">issued_at</span>{`:         "2026-04-01T09:14:00Z",
  `}<span className="text-[var(--color-amber)]">proof</span>{`:             "0x7f3a...c91b"
}`}
            </pre>
            <div className="mt-6 pt-6 border-t border-[var(--color-border-subtle)] text-[12px] text-[var(--color-ink-muted)] leading-relaxed">
              Every field is bound to the payroll provider&apos;s own DKIM
              signature.{" "}
              <span className="text-[var(--color-ink-2)]">
                Modifying a single byte breaks the proof.
              </span>{" "}
              No Photoshop attack works. No copy-paste attack works. No SaaS
              impersonation attack works. It&apos;s math, not policy.
            </div>
          </div>
        </div>

        <p className="mt-12 max-w-3xl font-mono text-[13px] leading-relaxed text-[var(--color-ink-quiet)]">
          The browser is hard-locked via Content-Security-Policy headers.
          connect-src is whitelisted to Google&apos;s APIs and nothing else.
          If a future bug or dependency ever tries to POST the contents of a
          paystub anywhere, the browser refuses the request. The promise is
          architectural, not aspirational.{" "}
          <a
            href="https://github.com/mgsturdy/redactable/blob/main/next.config.ts"
            className="text-[var(--color-amber)] hover:underline"
          >
            Read the policy →
          </a>
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   HOW IT WORKS
   ============================================================ */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "You paste their email. We send the link.",
      body: "Drop the applicant's email into a single field. Redactable sends them a one-time link. No account on your end. No account on theirs. No app to install. No invoice to chase.",
    },
    {
      n: "02",
      title: "They sign in to Gmail. Their browser does the math.",
      body: "Read-only Gmail access, scoped to payroll senders only (gusto.com, rippling.com, justworks.com, adp.com). A zero-knowledge prover runs in their tab, built on zk.email's open-source SDK. Sixty to one-hundred-eighty seconds. Their token, their laptop, their math.",
    },
    {
      n: "03",
      title: "You get the verified numbers. Nothing else.",
      body: "Employer, gross, net, pay date, frequency, YTD. Cryptographically bound to the payroll provider's DKIM key. Delivered to your inbox the moment the applicant approves the release. You verify their income in the time it used to take Plaid to load.",
    },
  ];

  return (
    <section id="how" className="max-w-[1280px] mx-auto px-6 py-32">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-8">
        03 · How it works
      </div>
      <h2 className="font-display text-[44px] sm:text-[64px] leading-[0.95] tracking-[-0.015em] text-[var(--color-ink)] max-w-4xl mb-16">
        Three steps. No servers touching the paystub.
      </h2>
      <div className="space-y-0 border-t border-[var(--color-border-subtle)]">
        {steps.map((step) => (
          <div
            key={step.n}
            className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-8 py-10 border-b border-[var(--color-border-subtle)]"
          >
            <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-quiet)]">
              {step.n}
            </div>
            <div className="font-display text-[28px] sm:text-[36px] leading-[1.05] text-[var(--color-ink)] tracking-[-0.01em]">
              {step.title}
            </div>
            <p className="text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   PRICING
   ============================================================ */
function Pricing() {
  return (
    <section id="pricing" className="bg-[var(--color-panel)] border-y border-[var(--color-border-subtle)] py-32">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-8">
          04 · Pricing
        </div>
        <h2 className="font-display text-[44px] sm:text-[64px] leading-[0.95] tracking-[-0.015em] text-[var(--color-ink)] max-w-4xl mb-16">
          One number.
          <br />
          <span className="italic text-[var(--color-ink-muted)]">
            Lower than Plaid.
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 items-start">
          <div className="rounded-lg border border-[var(--color-amber)] bg-[var(--color-amber-muted)] p-12">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-4">
              Pay as you go
            </div>
            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-display text-[96px] leading-none text-[var(--color-ink)]">
                $5
              </span>
              <span className="font-mono text-[13px] uppercase tracking-widest text-[var(--color-ink-muted)]">
                per verification
              </span>
            </div>
            <ul className="space-y-3 text-[15px] text-[var(--color-ink-2)]">
              <li>• First 10 verifications free</li>
              <li>• No subscription, no seat fees, no setup</li>
              <li>• You get billed when a proof lands in your inbox</li>
              <li>• Cancel by closing the tab</li>
            </ul>
          </div>

          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] p-12">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-quiet)] mb-4">
              What you were paying
            </div>
            <ul className="space-y-6 text-[15px] text-[var(--color-ink-2)]">
              <li className="flex items-baseline justify-between gap-4">
                <span>Plaid / Argyle / Pinwheel</span>
                <span className="font-display text-[22px] text-[var(--color-danger)]">
                  $8 – $25
                </span>
              </li>
              <li className="flex items-baseline justify-between gap-4">
                <span>TransUnion SmartMove</span>
                <span className="font-display text-[22px] text-[var(--color-danger)]">
                  $30 – $45
                </span>
              </li>
              <li className="flex items-baseline justify-between gap-4">
                <span>PDF paystub (fraud loss)</span>
                <span className="font-display text-[22px] text-[var(--color-danger)]">
                  one bad tenant
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FAQ
   ============================================================ */
function FAQ() {
  const qs = [
    {
      q: "Is this FCRA compliant?",
      a: "Yes. Consumer-permissioned data sharing, the same exemption Argyle and Pinwheel operate under. The applicant is the one disclosing their paystub to you through a tool they control. Redactable is not a consumer reporting agency and does not sell or resell the data.",
    },
    {
      q: "Which payroll providers work?",
      a: "Gusto, Rippling, and Justworks at launch. ADP, Paychex, QuickBooks Payroll, and Workday ship next. If your applicants use something else, tell us and we'll move it up the list.",
    },
    {
      q: "What if the applicant is 1099 or self-employed?",
      a: "Different flow. Stripe receipts, platform payout emails, or direct deposit summaries all work. We're shipping those blueprints next. Email us if you need one now.",
    },
    {
      q: "What does the applicant actually do?",
      a: "Click the link. Sign in with Google. Review which fields will ship to you. Approve or cancel. Sixty to one hundred eighty seconds, start to finish. No account, no password, no install.",
    },
    {
      q: "What does Redactable see?",
      a: "The cryptographic proof and the extracted fields. A ~20KB blob of math. We never see the raw email, the applicant's Google token, or their inbox. Our database has nothing that could identify them.",
    },
    {
      q: "What if the proof is forged?",
      a: "It can't be. Every field is bound to the payroll provider's own DKIM signature. Modifying a single byte of the gross pay number breaks the proof. Modifying the employer name breaks the proof. The math won't let you lie.",
    },
    {
      q: "Do I need a dashboard or account?",
      a: "Not yet. V0 is deliberately boring: paste an email, we send a link, you get a result in your inbox. API, webhooks, and a dashboard ship with V1 once we know what you actually need.",
    },
    {
      q: "What if the payroll email is too old or got deleted?",
      a: "The applicant picks which email to prove. If they've deleted every paystub in their Gmail, this flow won't find one. We return a clean 'no match' and you can fall back to your existing process.",
    },
  ];

  return (
    <section id="faq" className="max-w-[1280px] mx-auto px-6 py-32">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-8">
        05 · Obvious questions
      </div>
      <h2 className="font-display text-[44px] sm:text-[64px] leading-[0.95] tracking-[-0.015em] text-[var(--color-ink)] max-w-4xl mb-16">
        The ones we&apos;d ask too.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-6xl">
        {qs.map((item) => (
          <div key={item.q}>
            <div className="font-display text-[24px] leading-tight text-[var(--color-ink)] mb-3">
              {item.q}
            </div>
            <p className="text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   FINAL CTA — access form
   ============================================================ */
function FinalCTA() {
  return (
    <section
      id="access"
      className="bg-[var(--color-panel)] border-y border-[var(--color-border-subtle)] py-32 md:py-48 text-center"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-8">
          Get early access
        </div>
        <h2 className="font-display text-[56px] sm:text-[96px] md:text-[120px] leading-[0.9] tracking-[-0.02em] text-[var(--color-ink)] max-w-5xl mx-auto">
          Your next applicant
          <br />
          can prove income
          <br />
          <span className="italic text-[var(--color-amber)]">in 60 seconds</span>.
        </h2>
        <p className="mt-10 text-[18px] text-[var(--color-ink-muted)] max-w-xl mx-auto">
          Drop your email. We&apos;ll send you ten free verifications and a
          link your applicants can use today.
        </p>
        <form className="mt-12 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="you@property.com"
            className="flex-1 rounded-sm bg-white/[0.04] border border-[var(--color-border)] px-5 py-3.5 text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-quiet)] focus:outline-none focus:border-[var(--color-amber)] transition"
          />
          <button
            type="submit"
            className="rounded-sm bg-[var(--color-amber)] hover:bg-[var(--color-amber-hover)] text-black px-6 py-3.5 text-[15px] font-medium transition"
          >
            Request access
          </button>
        </form>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-quiet)]">
          No sales call. No contract. We&apos;ll email you a link.
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-canvas)]">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Logo size="sm" />
            <p className="mt-4 text-[14px] leading-relaxed text-[var(--color-ink-muted)] max-w-sm">
              Verified income from a payroll email. Without the bank login.
              Without the PDF. Without ever trusting us.
            </p>
          </div>
          <FooterCol
            title="Product"
            links={[
              ["Why", "#problem"],
              ["How it works", "#how"],
              ["Pricing", "#pricing"],
              ["FAQ", "#faq"],
            ]}
          />
          <FooterCol
            title="Trust"
            links={[
              ["Open source", "https://github.com/mgsturdy/redactable"],
              ["CSP policy", "https://github.com/mgsturdy/redactable/blob/main/next.config.ts"],
              ["Report a leak", "https://github.com/mgsturdy/redactable/issues"],
              ["Watch the math run", "/connect"],
            ]}
          />
        </div>
        <div className="mt-16 pt-8 border-t border-[var(--color-border-subtle)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-quiet)]">
          <div>© 2026 Redactable · USA</div>
          <div className="flex items-center gap-4">
            <span>
              Built on{" "}
              <a
                href="https://zk.email"
                className="text-[var(--color-amber)] hover:text-[var(--color-amber-hover)] transition"
              >
                zk.email
              </a>
            </span>
            <span aria-hidden>·</span>
            <span>Open source. Audit every byte.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-quiet)] mb-4">
        {title}
      </div>
      <ul className="space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-[14px] text-[var(--color-ink-2)] hover:text-[var(--color-ink)] transition"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
