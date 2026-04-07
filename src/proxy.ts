import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge proxy (formerly middleware in Next.js ≤15).
 *
 * Belt-and-suspenders for the Cross-Origin-Opener-Policy header that
 * Google Identity Services requires. The same value is set in
 * next.config.ts via the headers() config, but that path can be skipped
 * if a response is served from a stale CDN cache layer or a redirect.
 * Setting it here on every request guarantees the header reaches the
 * browser before the GIS popup tries to poll window.closed.
 */
export function proxy(_request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set(
    "Cross-Origin-Opener-Policy",
    "same-origin-allow-popups"
  );
  return response;
}

export const config = {
  // Run on every page route, skip Next internals and the proofs API.
  matcher: [
    "/((?!api|_next/static|_next/image|icon\\.svg|apple-icon\\.svg|favicon\\.ico).*)",
  ],
};
