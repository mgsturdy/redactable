# Redactable

> Sell verified spend data from your email. We architecturally cannot see a thing.

Redactable lets consumers prove facts about their email receipts — "this user spent $34.20 at DoorDash on March 28" — without revealing anything else. The proofs are zero-knowledge, generated on the user's own machine, and sold to researchers who only ever receive the math.

**This is the marketing site and reference client.** The proof generation happens entirely in your browser. The server at `redactable.xyz` never sees your emails, your OAuth tokens, or any personal information. You can verify this yourself by opening DevTools → Network and watching the live network panel on the homepage.

## Trust model

The privacy claim is not "we promise not to look." It's "we cannot."

1. **OAuth token never leaves the browser.** Google Identity Services issues the access token directly to your browser. The server has no session, no token storage, no backend OAuth route.
2. **Emails never leave the browser.** `gmail.googleapis.com` is called from your browser directly. Raw MIME stays in your tab's memory.
3. **Proof generation runs locally.** The `@zk-email/sdk` prover runs in a Web Worker in your browser. It's slower than remote proving — that's the point.
4. **Only the finished proof is uploaded.** The proof bundle is PII-free by construction. We store it and relay it to buyers.
5. **CSP enforces it.** The `Content-Security-Policy` header locks `connect-src` to a short allowlist (Google APIs, our own origin, the zk.email conductor). If a future bug or dependency ever tries to POST email content anywhere else, the browser blocks the request. The promise is enforced by the browser, not by trust.

Read the policy in [`next.config.ts`](./next.config.ts).

## What's shipped

**v0 (now):**
- Marketing site with live network panel proving our server receives nothing
- Strict CSP enforcing the trust model
- Ride-history preview using the community `rutefig/UberReceipt` blueprint (header-only — proves the technology end-to-end, no dollar amounts yet)

**v1 (next):**
- First production blueprint that extracts dollar totals, merchant, and date from DoorDash receipts
- Proof marketplace — anonymized bundles listed for research buyers

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind v4 (CSS-first tokens)
- TypeScript
- [`@zk-email/sdk`](https://github.com/zkemail/zk-email-sdk-js) for proof generation
- Google Identity Services for client-side OAuth
- Deployed on Vercel

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

## License

MIT — see [LICENSE](./LICENSE).

The whole browser client is here. Audit it. Fork it. If you find a way email content could leak, open an issue immediately.
