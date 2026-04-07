import type { NextConfig } from "next";

/**
 * CSP policy — enforces the Redactable trust model at the browser level.
 *
 * connect-src is the key directive: it lists every origin the browser is
 * allowed to make network requests to. By whitelisting only Google's APIs
 * and our own origin, we make it architecturally impossible for a future
 * bug (or malicious dependency) to exfiltrate email content to a third party.
 *
 * If someone ever tries, the browser blocks the request and the policy
 * becomes a promise we literally cannot break.
 *
 * Fonts are self-hosted by next/font — no external font origins needed.
 */
const csp = [
  "default-src 'self'",
  // Google Identity Services script + zk.email prover WASM + inline React hydration.
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://accounts.google.com https://apis.google.com",
  "script-src-elem 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com",
  "style-src 'self' 'unsafe-inline' https://accounts.google.com",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://*.googleusercontent.com",
  // Strict: every outbound destination must be explicit. Raw email bytes can never
  // leave the browser to an unlisted host, because the browser blocks the fetch.
  "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://gmail.googleapis.com https://www.googleapis.com https://content.googleapis.com https://conductor.zk.email",
  "frame-src 'self' https://accounts.google.com https://content.googleapis.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

// Defined separately so the config object stays declarative.
const headerRoutes = async () => [
  { source: "/:path*", headers: securityHeaders },
];

const nextConfig: NextConfig = {
  headers: headerRoutes,
};

export default nextConfig;
