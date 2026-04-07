import { Logo } from "@/components/Logo";
import { NetworkPanel } from "@/components/NetworkPanel";
import { Estimator } from "@/components/Estimator";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <Nav />
      <Hero />
      <Thesis />
      <SeenVsNotSeen />
      <WhoPays />
      <EarningsSection />
      <HowItWorks />
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
        <Logo size="sm" />
        <div className="hidden md:flex items-center gap-8 text-[14px] text-[var(--color-ink-2)]">
          <a href="#thesis" className="hover:text-[var(--color-ink)] transition">
            Thesis
          </a>
          <a href="#how" className="hover:text-[var(--color-ink)] transition">
            How
          </a>
          <a href="#buyers" className="hover:text-[var(--color-ink)] transition">
            Who pays
          </a>
          <a href="#faq" className="hover:text-[var(--color-ink)] transition">
            FAQ
          </a>
          <a
            href="https://github.com/mgsturdy/redactable"
            className="font-mono text-[12px] uppercase tracking-widest hover:text-[var(--color-ink)] transition"
          >
            Source
          </a>
        </div>
        <a
          href="#waitlist"
          className="inline-flex items-center rounded-sm bg-[var(--color-amber)] hover:bg-[var(--color-amber-hover)] text-black px-4 py-2 text-[14px] font-medium transition"
        >
          Join waitlist
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
            V0 Beta · Live May 2026
          </div>

          <h1 className="font-display text-[64px] sm:text-[88px] md:text-[112px] leading-[0.9] tracking-[-0.02em] text-[var(--color-ink)]">
            You&apos;re not the
            <br />
            <span className="italic text-[var(--color-ink-2)]">product</span>
            <br />
            anymore.
          </h1>

          <p className="mt-10 max-w-xl text-[19px] leading-[1.5] text-[var(--color-ink-muted)]">
            Your inbox is worth money to researchers. We built the vault that
            lets you sell it{" "}
            <span className="text-[var(--color-ink-2)]">
              without anyone — including us — ever reading it
            </span>
            .
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-amber)] hover:bg-[var(--color-amber-hover)] text-black px-6 py-3.5 text-[15px] font-medium transition"
            >
              Reserve your cut
              <span aria-hidden>→</span>
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-sm border border-[var(--color-border)] bg-white/[0.02] hover:bg-white/[0.06] text-[var(--color-ink-2)] px-6 py-3.5 text-[15px] transition"
            >
              See the math
            </a>
          </div>

          <div className="mt-12 flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-quiet)]">
            <span>USA only</span>
            <span>·</span>
            <span>Gmail + Outlook</span>
            <span>·</span>
            <span>Zero PII</span>
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
   THESIS — the manifesto
   ============================================================ */
function Thesis() {
  return (
    <section id="thesis" className="max-w-[1280px] mx-auto px-6 py-32 md:py-48">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-8">
        01 · Thesis
      </div>
      <h2 className="font-display text-[44px] sm:text-[64px] md:text-[80px] leading-[0.95] tracking-[-0.015em] text-[var(--color-ink)] max-w-5xl">
        Your data has been a fire sale since the early 2000s.
        <br />
        <span className="text-[var(--color-ink-muted)]">
          Brokers made billions.
        </span>
        <br />
        <span className="text-[var(--color-ink-muted)]">You made nothing.</span>
        <br />
        <span className="italic">We&apos;re renegotiating the contract.</span>
      </h2>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <Stat value="$250B" label="global data broker market in 2026" />
        <Stat value="$0" label="of that ever reached you" />
        <Stat value="80/20" label="split, in your favor" />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-[56px] leading-none text-[var(--color-ink)]">
        {value}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-quiet)] mt-3">
        {label}
      </div>
    </div>
  );
}

/* ============================================================
   SEEN vs NOT SEEN — the whole privacy pitch
   ============================================================ */
function SeenVsNotSeen() {
  return (
    <section className="bg-[var(--color-panel)] border-y border-[var(--color-border-subtle)] py-32">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-8">
          02 · The Math
        </div>
        <h2 className="font-display text-[44px] sm:text-[64px] leading-[0.95] tracking-[-0.015em] text-[var(--color-ink)] max-w-4xl mb-16">
          What leaves your browser.
          <br />
          <span className="text-[var(--color-ink-muted)] italic">
            And what doesn&apos;t.
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stays private */}
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-danger)]" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-quiet)]">
                stays in your browser · nobody sees this
              </span>
            </div>
            <ul className="space-y-2 text-[var(--color-ink-2)]">
              {[
                "Your email address",
                "Your name",
                "Your home address",
                "Your phone number",
                "Your credit card digits",
                "Item-level detail (what exactly you ordered)",
                "The people you email",
                "Your password",
                "Your other messages",
                "Anything else Google has on you",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Redacted />
                  <span className="line-through decoration-[var(--color-redact)] decoration-2">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ships in the proof — the valuable payload */}
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-ok)]" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-quiet)]">
                ships in the proof · the valuable part
              </span>
            </div>
            <pre className="font-mono text-[12px] leading-relaxed text-[var(--color-ink-2)] overflow-x-auto">
{`{
  `}<span className="text-[var(--color-amber)]">merchant</span>{`:        "DoorDash",
  `}<span className="text-[var(--color-amber)]">merchant_domain</span>{`: "doordash.com",
  `}<span className="text-[var(--color-amber)]">category</span>{`:        "food_delivery",
  `}<span className="text-[var(--color-amber)]">amount_cents</span>{`:    3420,
  `}<span className="text-[var(--color-amber)]">currency</span>{`:        "USD",
  `}<span className="text-[var(--color-amber)]">tip_cents</span>{`:       520,
  `}<span className="text-[var(--color-amber)]">timestamp</span>{`:       "2026-04-03T14:22:00Z",
  `}<span className="text-[var(--color-amber)]">metro</span>{`:           "US-NY-NYC",
  `}<span className="text-[var(--color-amber)]">payment_method</span>{`:  "card",
  `}<span className="text-[var(--color-amber)]">is_first_order</span>{`:  false,
  `}<span className="text-[var(--color-amber)]">dkim_valid</span>{`:      true,
  `}<span className="text-[var(--color-amber)]">anon_user_id</span>{`:    "p_8f2a...c91b",
  `}<span className="text-[var(--color-amber)]">proof</span>{`:           "0x7f3a...c91b"
}`}
            </pre>
            <div className="mt-6 pt-6 border-t border-[var(--color-border-subtle)] text-[12px] text-[var(--color-ink-muted)] leading-relaxed">
              The merchant, amount, category, metro, and timestamp are the
              signal funds pay for.{" "}
              <span className="text-[var(--color-ink-2)]">
                None of this can be traced back to you
              </span>
              . The anon_user_id is a one-way poseidon hash — stable across
              your own receipts so a panel works, unreversible to your email.
            </div>
          </div>
        </div>

        <p className="mt-12 max-w-3xl font-mono text-[13px] leading-relaxed text-[var(--color-ink-quiet)]">
          The browser is hard-locked via Content-Security-Policy headers.
          connect-src is whitelisted to Google&apos;s APIs and nothing else.
          If a future bug or dependency ever tries to POST the contents of
          your email anywhere, the browser blocks the request. The promise
          is architectural, not aspirational.{" "}
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

function Redacted() {
  return (
    <span
      aria-hidden
      className="inline-block w-4 h-2 bg-[var(--color-redact)] border border-[rgba(255,255,255,0.1)]"
    />
  );
}

/* ============================================================
   WHO PAYS — 3 buyer personas
   ============================================================ */
function WhoPays() {
  return (
    <section id="buyers" className="max-w-[1280px] mx-auto px-6 py-32">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-8">
        03 · Who pays
      </div>
      <h2 className="font-display text-[44px] sm:text-[64px] leading-[0.95] tracking-[-0.015em] text-[var(--color-ink)] max-w-4xl mb-4">
        Researchers. Not advertisers.
      </h2>
      <p className="text-[var(--color-ink-muted)] text-[18px] max-w-2xl mb-16">
        Three buyers. None of them want you as a target. All of them want the
        signal without the PII.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BuyerCard
          tag="Alt-data funds"
          title="The $50B fund."
          body="They want to read DoorDash's next earnings report thirty days before it prints. Aggregated verified receipts across 10,000 real users tell them whether Q3 beat consensus. They pay $50k to $500k per dataset, per quarter."
          price="$0.15 – $0.40"
          priceLabel="per verified receipt"
        />
        <BuyerCard
          tag="Academia"
          title="The Stanford paper."
          body="Her consumer behavior study needs real spending data without an IRB nightmare. Verified panels from verified humans, with cryptographic provenance, sold per-record. Published papers, not ad targeting."
          price="$2 – $10"
          priceLabel="per panelist / month"
        />
        <BuyerCard
          tag="Underwriters"
          title="The credit union."
          body="Your bank statement can be faked. Your Uber Eats payout emails can't. Lenders pay for proof-of-income that can't be forged, sent directly by you when you apply for a loan. You get cut in every time."
          price="$5 – $25"
          priceLabel="per verified claim"
        />
      </div>

      <p className="mt-12 font-mono text-[12px] text-[var(--color-ink-quiet)] max-w-3xl">
        * Not in scope: ad networks, data brokers, anyone who wants to target
        you back. If we ever accept that kind of buyer, we stop being
        Redactable.
      </p>
    </section>
  );
}

function BuyerCard({
  tag,
  title,
  body,
  price,
  priceLabel,
}: {
  tag: string;
  title: string;
  body: string;
  price: string;
  priceLabel: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white/[0.02] p-8 flex flex-col">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-quiet)] mb-6">
        {tag}
      </div>
      <div className="font-display text-[32px] leading-none text-[var(--color-ink)] mb-5">
        {title}
      </div>
      <p className="text-[15px] leading-relaxed text-[var(--color-ink-muted)] mb-8 flex-1">
        {body}
      </p>
      <div className="pt-6 border-t border-[var(--color-border-subtle)]">
        <div className="font-display text-[28px] text-[var(--color-amber)]">
          {price}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-quiet)] mt-1">
          {priceLabel}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EARNINGS
   ============================================================ */
function EarningsSection() {
  return (
    <section className="bg-[var(--color-panel)] border-y border-[var(--color-border-subtle)] py-32">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-8">
          04 · Your cut
        </div>
        <h2 className="font-display text-[44px] sm:text-[64px] leading-[0.95] tracking-[-0.015em] text-[var(--color-ink)] max-w-4xl mb-4">
          Drag the sliders.
          <br />
          <span className="text-[var(--color-ink-muted)] italic">
            Find out what you&apos;ve been giving away.
          </span>
        </h2>
        <p className="text-[var(--color-ink-muted)] text-[17px] max-w-2xl mb-12">
          Honest numbers, benchmarked against current alt-data market rates.
          We split 80/20 in your favor, always.
        </p>
        <Estimator />
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
      title: "Google hands your emails to your browser.",
      body: "Not to us. You OAuth directly with Google. The token never touches our server. We have no session, no backend auth route, nothing to leak.",
    },
    {
      n: "02",
      title: "Your laptop does the math.",
      body: "A zero-knowledge prover runs in a Web Worker in your tab. Sixty to one hundred eighty seconds per receipt. Slower than remote proving. That's the whole point.",
    },
    {
      n: "03",
      title: "You review what the proof contains.",
      body: "Line by line. Every field that will be published is shown to you before it ships. If you don't like what it says, hit cancel. Nothing leaves.",
    },
    {
      n: "04",
      title: "You publish. The proof ships. You get paid.",
      body: "Only the finished proof is uploaded. Our server receives a ~20KB JSON blob of math and nothing else. Buyers get verified data. You get your cut.",
    },
  ];

  return (
    <section id="how" className="max-w-[1280px] mx-auto px-6 py-32">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-8">
        05 · How it actually works
      </div>
      <h2 className="font-display text-[44px] sm:text-[64px] leading-[0.95] tracking-[-0.015em] text-[var(--color-ink)] max-w-4xl mb-16">
        Four steps. Zero servers touching your email.
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
   FAQ
   ============================================================ */
function FAQ() {
  const qs = [
    {
      q: "Can you see my emails?",
      a: "No. The browser blocks us. Read the Content-Security-Policy header on this page. connect-src is whitelisted to Google's APIs and our own origin. If any code on this page tries to POST the contents of your email anywhere else, the browser refuses the request.",
    },
    {
      q: "What if you get hacked?",
      a: "There's nothing to steal. Our database contains finished zero-knowledge proofs. Proofs contain math. Math is not personal data. Even if we shipped every row tomorrow, no inbox contents would leak.",
    },
    {
      q: "Is this legal?",
      a: "USA only on purpose. California's CCPA governs the resale of personal information, and our whole design avoids that category: the proofs contain no personal information by construction. Once we onboard actual buyers we'll register as a data broker in California. GDPR is deliberately out of scope for V1.",
    },
    {
      q: "Who actually pays for this?",
      a: "Alt-data hedge funds, academic researchers, credit underwriters. Not ad networks. Not data brokers. Not your employer. If we ever accept that kind of buyer, we stop being Redactable.",
    },
    {
      q: "Why should I trust you?",
      a: "Don't. The entire browser client is open source. Audit every line. If you find a way email contents could leak, file an issue and we'll fix it publicly.",
    },
    {
      q: "How slow is the proof?",
      a: "Sixty to one-hundred eighty seconds per email on a normal laptop. Remote proving exists and is faster, but that would require sending the raw email to someone. We refuse the trade.",
    },
    {
      q: "Gmail only?",
      a: "Gmail and Outlook. Both flow through the same client-side SDK. Yahoo, iCloud, and ProtonMail are on the roadmap once V1 ships.",
    },
    {
      q: "What if Google gets subpoenaed?",
      a: "That's between you and Google. We're not in the chain. We don't have your token, your emails, or your identity. Our database contains proofs attached to a random user ID you control.",
    },
  ];

  return (
    <section id="faq" className="bg-[var(--color-panel)] border-y border-[var(--color-border-subtle)] py-32">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-8">
          06 · Obvious questions
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
      </div>
    </section>
  );
}

/* ============================================================
   FINAL CTA — waitlist
   ============================================================ */
function FinalCTA() {
  return (
    <section id="waitlist" className="max-w-[1280px] mx-auto px-6 py-32 md:py-48 text-center">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-8">
        Reserve your cut
      </div>
      <h2 className="font-display text-[56px] sm:text-[96px] md:text-[128px] leading-[0.9] tracking-[-0.02em] text-[var(--color-ink)] max-w-5xl mx-auto">
        Your inbox is{" "}
        <span className="italic text-[var(--color-amber)]">holding money</span>.
      </h2>
      <p className="mt-8 text-[18px] text-[var(--color-ink-muted)] max-w-xl mx-auto">
        First thousand users get priority payouts and a lifetime bump on the
        split.
      </p>
      <form className="mt-12 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="you@inbox.com"
          className="flex-1 rounded-sm bg-white/[0.04] border border-[var(--color-border)] px-5 py-3.5 text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-quiet)] focus:outline-none focus:border-[var(--color-amber)] transition"
        />
        <button
          type="submit"
          className="rounded-sm bg-[var(--color-amber)] hover:bg-[var(--color-amber-hover)] text-black px-6 py-3.5 text-[15px] font-medium transition"
        >
          Join waitlist
        </button>
      </form>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-quiet)]">
        We&apos;ll email you when V1 opens. Nothing else.
      </p>
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
              Sell verified spend data from your email. Without ever showing
              the email. Without ever trusting us.
            </p>
          </div>
          <FooterCol
            title="Product"
            links={[
              ["How it works", "#how"],
              ["Who pays", "#buyers"],
              ["Estimator", "#earnings"],
              ["FAQ", "#faq"],
            ]}
          />
          <FooterCol
            title="Trust"
            links={[
              ["Open source", "https://github.com/mgsturdy/redactable"],
              ["CSP policy", "https://github.com/mgsturdy/redactable/blob/main/next.config.ts"],
              ["Report a leak", "https://github.com/mgsturdy/redactable/issues"],
              ["Contribute", "https://github.com/mgsturdy/redactable"],
            ]}
          />
        </div>
        <div className="mt-16 pt-8 border-t border-[var(--color-border-subtle)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-quiet)]">
          <div>© 2026 Redactable · USA</div>
          <div>The client is open source. Audit every byte.</div>
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
