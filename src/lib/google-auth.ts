/**
 * Google Identity Services wrapper — pure client-side OAuth.
 *
 * Lazy-loads the GIS script from accounts.google.com, creates a token
 * client, and returns a raw access token to the caller. The token lives
 * only in the caller's closure — never stored in localStorage, never
 * sent to our server, never serialized.
 *
 * This is the implicit/token flow: no redirect, no backend session,
 * no cookies. Google issues the token directly to the browser via
 * postMessage from the popup.
 */

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: "Bearer";
  error?: string;
  error_description?: string;
};

type TokenClient = {
  requestAccessToken: (overrides?: Record<string, unknown>) => void;
};

type GoogleAccountsOAuth2 = {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    callback: (response: GoogleTokenResponse) => void;
    error_callback?: (err: { type: string; message?: string }) => void;
  }) => TokenClient;
  revoke: (token: string, done: () => void) => void;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: GoogleAccountsOAuth2;
      };
    };
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const GMAIL_READONLY_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
const GIS_SCRIPT_URL = "https://accounts.google.com/gsi/client";

let gisLoadPromise: Promise<void> | null = null;

function loadGis(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("GIS cannot load server-side"));
  }
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }
  if (gisLoadPromise) return gisLoadPromise;

  gisLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GIS_SCRIPT_URL}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Google Identity Services failed to load"))
      );
      return;
    }
    const script = document.createElement("script");
    script.src = GIS_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Google Identity Services failed to load"));
    document.head.appendChild(script);
  });

  return gisLoadPromise;
}

/**
 * Distinct error class so the UI can handle user-dismissed popups
 * gracefully instead of treating them as a crash.
 */
export class OAuthDismissedError extends Error {
  constructor(message = "You closed the Google sign-in window.") {
    super(message);
    this.name = "OAuthDismissedError";
  }
}

/**
 * Prompt the user to authorize Gmail read access and return the access token.
 * Token is only valid for ~1 hour. We request it fresh every session.
 */
export async function requestGmailAccessToken(): Promise<string> {
  if (!CLIENT_ID) {
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Check .env.local."
    );
  }
  await loadGis();

  return new Promise((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: GMAIL_READONLY_SCOPE,
      callback: (response) => {
        if (response.error) {
          reject(
            new Error(
              response.error_description ||
                response.error ||
                "OAuth failed"
            )
          );
          return;
        }
        if (!response.access_token) {
          reject(new Error("No access token returned"));
          return;
        }
        resolve(response.access_token);
      },
      error_callback: (err) => {
        // GIS fires this for popup_closed, popup_failed_to_open, user_cancel, etc.
        // All of those are user-dismissal, not crashes.
        const type = err.type ?? "";
        if (
          type === "popup_closed" ||
          type === "popup_failed_to_open" ||
          type === "user_cancel"
        ) {
          reject(new OAuthDismissedError());
          return;
        }
        reject(new Error(err.message ?? `OAuth error: ${type || "unknown"}`));
      },
    });
    // Don't force re-consent every call — let GIS use cached consent if available.
    client.requestAccessToken();
  });
}

/**
 * Revoke the access token. Best-effort — we don't wait for confirmation.
 */
export function revokeAccessToken(token: string): Promise<void> {
  return new Promise((resolve) => {
    if (!window.google?.accounts?.oauth2) {
      resolve();
      return;
    }
    window.google.accounts.oauth2.revoke(token, () => resolve());
  });
}
