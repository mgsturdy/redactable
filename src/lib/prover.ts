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

/**
 * Fetch a blueprint from conductor.zk.email, compile it in browser,
 * and generate a local proof against the given raw email string.
 */
export async function proveEmail(
  blueprintSlug: string,
  rawEml: string
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

  let valid = false;
  try {
    valid = await blueprint.validateEmail(rawEml);
    console.log("[redactable/prover] validateEmail:", valid);
  } catch (err) {
    console.warn(
      "[redactable/prover] validateEmail threw (continuing anyway):",
      err
    );
  }
  if (!valid) {
    throw new Error(
      "This email doesn't match the blueprint's expected sender/format. " +
        "The Uber receipt blueprint targets sptrans.uber.com (Portuguese rides). " +
        "If your Uber receipts come from a different sender domain (uber.com, " +
        "noreply@uber.us, etc.) you'll need a different blueprint."
    );
  }

  console.log("[redactable/prover] creating prover (isLocal: true)");
  const prover = blueprint.createProver({ isLocal: true });

  console.log("[redactable/prover] generating proof — this is the slow part");
  let proof;
  try {
    proof = await prover.generateProof(rawEml);
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
