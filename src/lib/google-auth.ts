/**
 * Google Identity Services wrapper — pure client-side OAuth.
 *
 * CRITICAL: GIS popup must be opened in the same synchronous task as
 * the user's click. If you `await` anything between the click handler
 * and `client.requestAccessToken()`, the user-activation token is
 * consumed and the popup gets blocked or closed instantly. The fix is
 * to PRELOAD the GIS script and the token client at page mount, then
 * call `requestAccessToken()` synchronously when the user clicks.
 *
 * Token lives only in the caller's closure — never stored in
 * localStorage, never sent to our server, never serialized.
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

export class OAuthDismissedError extends Error {
  constructor(message = "You closed the Google sign-in window.") {
    super(message);
    this.name = "OAuthDismissedError";
  }
}

let gisLoadPromise: Promise<void> | null = null;
let tokenClient: TokenClient | null = null;
let pendingResolvers: {
  resolve: (token: string) => void;
  reject: (err: Error) => void;
} | null = null;

function loadGisScript(): Promise<void> {
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
 * Preload GIS at page mount so the click handler can call
 * requestAccessToken() synchronously, preserving user activation.
 * Safe to call multiple times — it's idempotent.
 */
export async function preloadGoogleAuth(): Promise<void> {
  console.log("[redactable/auth] preloadGoogleAuth called");
  if (!CLIENT_ID) {
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Check .env.local."
    );
  }
  console.log("[redactable/auth] CLIENT_ID present:", CLIENT_ID.slice(0, 18) + "...");
  await loadGisScript();
  console.log("[redactable/auth] GIS script loaded");
  if (tokenClient) {
    console.log("[redactable/auth] tokenClient already initialized");
    return;
  }

  tokenClient = window.google!.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: GMAIL_READONLY_SCOPE,
    callback: (response) => {
      console.log("[redactable/auth] callback fired", {
        hasToken: !!response.access_token,
        error: response.error,
        scope: response.scope,
      });
      const r = pendingResolvers;
      pendingResolvers = null;
      if (!r) {
        console.warn("[redactable/auth] callback fired but no pendingResolvers");
        return;
      }
      if (response.error) {
        r.reject(
          new Error(
            response.error_description || response.error || "OAuth failed"
          )
        );
        return;
      }
      if (!response.access_token) {
        r.reject(new Error("No access token returned"));
        return;
      }
      console.log("[redactable/auth] resolving with token");
      r.resolve(response.access_token);
    },
    error_callback: (err) => {
      console.warn("[redactable/auth] error_callback fired", err);
      // Defer the rejection by a tick — if a successful callback is racing
      // to deliver via postMessage, it should win.
      setTimeout(() => {
        const r = pendingResolvers;
        if (!r) {
          console.log("[redactable/auth] success already handled, ignoring error_callback");
          return;
        }
        pendingResolvers = null;
        const type = err.type ?? "";
        if (
          type === "popup_closed" ||
          type === "popup_failed_to_open" ||
          type === "user_cancel"
        ) {
          r.reject(new OAuthDismissedError());
          return;
        }
        r.reject(new Error(err.message ?? `OAuth error: ${type || "unknown"}`));
      }, 600);
    },
  });
  console.log("[redactable/auth] tokenClient initialized, ready for click");
}

/**
 * Trigger the OAuth popup. MUST be called synchronously inside a user
 * gesture handler (a click). Returns a promise that resolves with the
 * access token when the user completes the consent flow.
 */
export function requestGmailAccessToken(): Promise<string> {
  console.log("[redactable/auth] requestGmailAccessToken called", {
    tokenClientReady: !!tokenClient,
    hasUserActivation: typeof navigator !== "undefined" && "userActivation" in navigator
      ? (navigator as Navigator & { userActivation?: { isActive: boolean } }).userActivation?.isActive
      : "unknown",
  });
  if (!tokenClient) {
    return Promise.reject(
      new Error(
        "Google auth not preloaded — call preloadGoogleAuth() before this."
      )
    );
  }
  return new Promise<string>((resolve, reject) => {
    if (pendingResolvers) {
      console.warn("[redactable/auth] replacing in-flight resolvers");
      pendingResolvers.reject(new OAuthDismissedError());
    }
    pendingResolvers = { resolve, reject };
    console.log("[redactable/auth] calling tokenClient.requestAccessToken() synchronously");
    // SYNCHRONOUS call inside the click handler — preserves user activation
    tokenClient!.requestAccessToken();
    console.log("[redactable/auth] requestAccessToken returned");
  });
}

export function revokeAccessToken(token: string): Promise<void> {
  return new Promise((resolve) => {
    if (!window.google?.accounts?.oauth2) {
      resolve();
      return;
    }
    window.google.accounts.oauth2.revoke(token, () => resolve());
  });
}
