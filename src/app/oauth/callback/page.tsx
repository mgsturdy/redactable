"use client";

import { useEffect, useState } from "react";

/**
 * OAuth callback receiver — runs inside the popup window after Google
 * redirects back with the access token in the URL fragment.
 *
 * Flow:
 *   1. Popup loaded at /oauth/callback#access_token=...&token_type=Bearer&expires_in=...
 *   2. This page reads the hash (URL fragments are NEVER sent to the server,
 *      so the access token never touches our backend)
 *   3. postMessage the token to window.opener
 *   4. Close the popup
 *
 * If anything goes wrong, we display the error and the user can close manually.
 */
export default function OAuthCallback() {
  const [status, setStatus] = useState<"working" | "ok" | "error">("working");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    try {
      // Hash starts with '#' — strip it. Format: access_token=X&token_type=Bearer&...
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) {
        setStatus("error");
        setErrorMsg("No fragment in callback URL.");
        return;
      }
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const error = params.get("error");
      const errorDescription = params.get("error_description");
      const stateFromUrl = params.get("state");

      if (error) {
        setStatus("error");
        setErrorMsg(errorDescription || error);
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "redactable:oauth",
              ok: false,
              error: errorDescription || error,
              state: stateFromUrl,
            },
            window.location.origin
          );
        }
        return;
      }

      if (!accessToken) {
        setStatus("error");
        setErrorMsg("No access token in callback URL.");
        return;
      }

      if (!window.opener) {
        setStatus("error");
        setErrorMsg(
          "This page should have been opened in a popup. window.opener is null."
        );
        return;
      }

      window.opener.postMessage(
        {
          type: "redactable:oauth",
          ok: true,
          accessToken,
          expiresIn: parseInt(params.get("expires_in") ?? "3600", 10),
          state: stateFromUrl,
        },
        window.location.origin
      );
      setStatus("ok");
      // Give the postMessage a moment to land before closing
      setTimeout(() => window.close(), 200);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  return (
    <main className="min-h-dvh flex items-center justify-center bg-[var(--color-canvas)] text-[var(--color-ink)] p-8">
      <div className="max-w-md text-center font-mono text-[14px]">
        {status === "working" && (
          <p className="text-[var(--color-amber)]">Receiving token...</p>
        )}
        {status === "ok" && (
          <p className="text-[var(--color-ok)]">
            Token received. You can close this window.
          </p>
        )}
        {status === "error" && (
          <>
            <p className="text-[var(--color-danger)] mb-4">OAuth error</p>
            <p className="text-[var(--color-ink-muted)] text-[12px] break-words">
              {errorMsg}
            </p>
          </>
        )}
      </div>
    </main>
  );
}
