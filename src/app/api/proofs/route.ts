import { NextRequest, NextResponse } from "next/server";

/**
 * The ONLY backend endpoint in Redactable V0.
 *
 * Accepts finished ZK proof bundles from the browser client. The body
 * should contain the proof and its public data — nothing else. In
 * particular, it MUST NOT contain raw email content, user PII, OAuth
 * tokens, or anything else that would violate the trust model.
 *
 * V0 just logs. V1 will:
 *   - validate with Zod against a strict schema
 *   - reject bodies larger than 100KB
 *   - store in Vercel Postgres (Neon)
 *   - enforce rate limits per anon_user_id
 *   - return a shareable proof URL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Size guard — a typical zk.email proof is 5–50KB. Anything bigger
    // is either a bug or an attempt to smuggle something.
    const raw = JSON.stringify(body);
    if (raw.length > 200_000) {
      return NextResponse.json(
        { error: "Payload too large" },
        { status: 413 }
      );
    }

    // V0 guardrail — reject payloads that look like raw email content.
    // Raw RFC822 emails always have "From:" and "Received:" header lines.
    // If the body contains either, something is very wrong.
    if (
      /(^|\n)From:\s/.test(raw) ||
      /(^|\n)Received:\s/.test(raw) ||
      /Content-Transfer-Encoding:/.test(raw)
    ) {
      return NextResponse.json(
        {
          error:
            "Payload contains email headers. Proofs must not include raw email content. Refusing.",
        },
        { status: 400 }
      );
    }

    const proofId = crypto.randomUUID();

    // V0: log structured metadata only (no proof contents).
    console.log("[proofs] received", {
      id: proofId,
      blueprint: body?.blueprint ?? "(unknown)",
      payloadBytes: raw.length,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        ok: true,
        id: proofId,
        receivedAt: new Date().toISOString(),
        bytes: raw.length,
      },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bad request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
