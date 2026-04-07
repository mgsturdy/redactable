/**
 * Thin wrapper around the zk.email SDK.
 *
 * Runs on the main thread for V0 — this means the UI will be unresponsive
 * during the 60–180 seconds of proof generation. That is intentional for
 * the demo: the user literally watches their browser do the hard work,
 * which is the entire privacy pitch.
 *
 * V1 will move this into a Web Worker so the UI stays smooth.
 */

import { initZkEmailSdk } from "@zk-email/sdk";

const sdk = initZkEmailSdk();

export type ProofResult = {
  blueprintSlug: string;
  proofJson: unknown;
  publicData: Record<string, unknown>;
  generatedAtMs: number;
  durationMs: number;
};

export type ExternalInput = {
  name: string;
  value: string;
  maxLength: number;
};

/**
 * Fetch a blueprint from conductor.zk.email, compile it in browser,
 * and generate a local proof against the given raw email string.
 */
export async function proveEmail(
  blueprintSlug: string,
  rawEml: string,
  externalInputs: ExternalInput[] = []
): Promise<ProofResult> {
  const start = Date.now();

  console.log("[redactable/prover] fetching blueprint:", blueprintSlug);
  let blueprint;
  try {
    blueprint = await sdk.getBlueprint(blueprintSlug);
  } catch (err) {
    console.error("[redactable/prover] getBlueprint failed:", err);
    throw new Error(
      `Blueprint fetch failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
  console.log("[redactable/prover] blueprint loaded");

  // SDK signature is `validateEmail(eml: string): Promise<void>` — it throws on
  // invalid email instead of returning a boolean. Catch and surface the reason.
  try {
    await blueprint.validateEmail(rawEml);
    console.log("[redactable/prover] validateEmail: passed");
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.warn("[redactable/prover] validateEmail failed:", detail);
    throw new Error(
      `Email validation failed against blueprint ${blueprintSlug}. ` +
        `This usually means the email's DKIM sender doesn't match what the ` +
        `blueprint expects, or the body format has drifted. Underlying: ${detail}`
    );
  }

  console.log("[redactable/prover] creating prover (isLocal: true)");
  const prover = blueprint.createProver({ isLocal: true });

  console.log(
    "[redactable/prover] generating proof — this is the slow part",
    { externalInputs }
  );
  // Hard timeout — the SDK runs the prover in a Web Worker and worker errors
  // (e.g. CSP-blocked fetches) don't always propagate back to the main thread.
  // Without this race the await would hang forever and the UI animation would
  // never know to stop. 5 minutes is generous; real proofs are 1–3 min.
  const PROVER_TIMEOUT_MS = 5 * 60 * 1000;
  let proof;
  try {
    proof = await Promise.race([
      prover.generateProof(rawEml, externalInputs),
      new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                `Proof generation timed out after ${PROVER_TIMEOUT_MS / 1000}s. ` +
                  `Check the browser console for CSP errors or worker failures — ` +
                  `the prover sometimes hangs silently when its background fetches fail.`
              )
            ),
          PROVER_TIMEOUT_MS
        )
      ),
    ]);
  } catch (err) {
    console.error("[redactable/prover] generateProof failed:", err);
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`Proof generation failed: ${detail}`);
  }
  console.log("[redactable/prover] proof generated successfully");

  const durationMs = Date.now() - start;
  const proofJson = JSON.parse(JSON.stringify(proof));
  const publicData =
    (proof as { publicData?: Record<string, unknown> }).publicData ?? {};

  return {
    blueprintSlug,
    proofJson,
    publicData,
    generatedAtMs: start,
    durationMs,
  };
}
