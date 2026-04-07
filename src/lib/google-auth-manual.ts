/**
 * Manual Google OAuth — bypasses Google Identity Services entirely.
 *
 * GIS has been unreliable in our testing (popup_closed false positives,
 * storagerelay communication failures, COOP polling noise). This module
 * implements the OAuth implicit/token flow ourselves:
 *
 *   1. Build the standard Google OAuth 2.0 authorization URL
 *   2. window.open() the popup ourselves (must be called inside a click)
 *   3. Listen for a postMessage from /oauth/callback inside the popup
 *   4. Resolve with the access token
 *
 * The access token is delivered via the URL fragment (#access_token=...)
 * which is NEVER sent to our server — JavaScript on the callback page
 * extracts it client-side and postMessages it to this opener window.
 */

import { OAuthDismissedError } from "./google-auth";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const GMAIL_READONLY_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";

type CallbackMessage =
  | {
      type: "redactable:oauth";
      ok: true;
      accessToken: string;
      expiresIn: number;
      state: string | null;
    }
  | {
      type: "redactable:oauth";
      ok: false;
      error: string;
      state: string | null;
    };

function isCallbackMessage(data: unknown): data is CallbackMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { type?: unknown }).type === "redactable:oauth"
  );
}

function buildAuthUrl(state: string): string {
  const redirectUri = `${window.location.origin}/oauth/callback`;
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "token",
    scope: GMAIL_READONLY_SCOPE,
    include_granted_scopes: "true",
    state,
    prompt: "select_account",
  });
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Open the OAuth popup and wait for the token. MUST be called
 * synchronously inside a user gesture handler (a click).
 */
export function manualGmailAuth(): Promise<string> {
  if (!CLIENT_ID) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set.")
    );
  }

  // Random state for CSRF / message correlation
  const state =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  const url = buildAuthUrl(state);
  const features = "popup=yes,width=500,height=620,left=200,top=100";

  // SYNCHRONOUS popup open inside the click handler
  const opened = window.open(url, "redactable_oauth", features);
  if (!opened) {
    return Promise.reject(
      new OAuthDismissedError(
        "Browser blocked the popup. Allow popups for this site and try again."
      )
    );
  }
  // Now-narrowed const that TypeScript will track inside closures
  const popup: Window = opened;

  return new Promise<string>((resolve, reject) => {
    let settled = false;
    const expectedOrigin = window.location.origin;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== expectedOrigin) return;
      if (!isCallbackMessage(event.data)) return;
      if (event.data.state !== state) return;

      cleanup();
      if (event.data.ok) {
        console.log("[redactable/manual-auth] received token via postMessage");
        resolve(event.data.accessToken);
      } else {
        console.warn(
          "[redactable/manual-auth] callback reported error:",
          event.data.error
        );
        reject(new Error(event.data.error));
      }
    };

    // Detect manual popup close (user X-ing out before completing)
    const closedPoll = setInterval(() => {
      if (settled) return;
      let isClosed = false;
      try {
        isClosed = popup.closed;
      } catch {
        // COOP can throw on closed access in some browsers — treat as still open
        return;
      }
      if (isClosed) {
        cleanup();
        reject(new OAuthDismissedError());
      }
    }, 500);

    // Hard timeout — 5 minutes is plenty for any user
    const timeout = setTimeout(
      () => {
        cleanup();
        reject(new Error("OAuth timed out after 5 minutes."));
      },
      5 * 60 * 1000
    );

    function cleanup() {
      if (settled) return;
      settled = true;
      window.removeEventListener("message", onMessage);
      clearInterval(closedPoll);
      clearTimeout(timeout);
      try {
        if (!popup.closed) popup.close();
      } catch {
        // ignore — popup may be on a different origin and inaccessible
      }
    }

    window.addEventListener("message", onMessage);
    console.log(
      "[redactable/manual-auth] popup opened, waiting for postMessage"
    );
  });
}
