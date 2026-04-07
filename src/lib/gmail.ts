/**
 * Gmail API — direct browser-to-Google fetches.
 *
 * Every call in this file originates from the user's browser and talks
 * directly to gmail.googleapis.com with the access token. Our server is
 * not in the data path. Raw email bytes stay in the user's tab memory.
 */

export type MessageInfo = {
  id: string;
  threadId: string;
};

type ListResponse = {
  messages?: MessageInfo[];
  nextPageToken?: string;
  resultSizeEstimate?: number;
};

type RawMessageResponse = {
  id: string;
  threadId: string;
  internalDate: string;
  raw: string; // base64url-encoded RFC822
};

const GMAIL_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

/**
 * List message IDs matching a Gmail search query.
 * The query uses Gmail's native search syntax: "from:uber.com", etc.
 */
export async function listMessages(
  accessToken: string,
  query: string,
  maxResults = 10
): Promise<MessageInfo[]> {
  const url = new URL(`${GMAIL_BASE}/messages`);
  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", String(maxResults));

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Gmail list failed (${res.status}): ${text.slice(0, 200)}`
    );
  }
  const data = (await res.json()) as ListResponse;
  return data.messages ?? [];
}

/**
 * Fetch a single message in raw RFC822 format and decode it to a string.
 * The raw string is what the zk.email prover expects.
 */
export async function fetchRawMessage(
  accessToken: string,
  messageId: string
): Promise<{ id: string; rawEml: string; internalDate: string }> {
  const url = new URL(`${GMAIL_BASE}/messages/${messageId}`);
  url.searchParams.set("format", "raw");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Gmail get failed (${res.status}): ${text.slice(0, 200)}`
    );
  }
  const data = (await res.json()) as RawMessageResponse;
  const rawEml = decodeBase64Url(data.raw);
  return { id: data.id, rawEml, internalDate: data.internalDate };
}

/**
 * Gmail returns `raw` as base64url (URL-safe variant of base64).
 * Convert to standard base64, then decode to a string via atob.
 */
function decodeBase64Url(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  // atob returns a binary string where each char is one byte.
  // This works for RFC822 which is ASCII-safe at the protocol level.
  const binary = atob(base64);
  // Convert to UTF-8 string properly (emails can contain UTF-8 in bodies/subjects).
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder("utf-8").decode(bytes);
}

/**
 * Tiny preview extractor — pulls the subject + date out of a raw email for
 * display in the UI before proving. Not cryptographically meaningful, just
 * so the user can recognize which email they're about to prove.
 */
export function extractPreview(rawEml: string): {
  subject: string;
  from: string;
  date: string;
} {
  const headerEnd = rawEml.indexOf("\r\n\r\n");
  const headers = headerEnd >= 0 ? rawEml.slice(0, headerEnd) : rawEml;
  const get = (name: string) => {
    const match = headers.match(new RegExp(`^${name}:\\s*(.+)$`, "im"));
    return match?.[1]?.trim() ?? "";
  };
  return {
    subject: get("Subject") || "(no subject)",
    from: get("From") || "(unknown sender)",
    date: get("Date") || "",
  };
}
