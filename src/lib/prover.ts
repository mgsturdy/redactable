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

  const blueprint = await sdk.getBlueprint(blueprintSlug);
  const prover = blueprint.createProver({ isLocal: true });

  // SDK accepts the raw MIME string directly as first arg.
  // No externalInputs for UberReceipt — it only extracts from the email.
  const proof = await prover.generateProof(rawEml);

  const durationMs = Date.now() - start;

  // The SDK's Proof object exposes a JSON-serializable form for publishing.
  // Serialize via JSON.parse(JSON.stringify(...)) to strip class instances.
  const proofJson = JSON.parse(JSON.stringify(proof));

  // Public extracted values from the blueprint's regex decomposition,
  // if the SDK exposes them. Fall back to the whole proof if the shape is unknown.
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
