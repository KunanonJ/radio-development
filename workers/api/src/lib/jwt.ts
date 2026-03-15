/**
 * Minimal JWT sign/verify for widget tokens using HMAC-SHA256.
 * Payload: { stationId: string, exp: number, userId?: string }
 */
const DEFAULT_TTL_SEC = 60 * 60 * 24; // 24h

function base64UrlEncode(data: ArrayBuffer | Uint8Array): string {
  const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4;
  if (pad) str += "===".slice(0, 4 - pad);
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getSigningKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  return key;
}

export interface WidgetTokenPayload {
  stationId: string;
  exp: number;
  userId?: string;
}

export async function signWidgetToken(
  secret: string,
  stationId: string,
  options?: { userId?: string; ttlSec?: number }
): Promise<string> {
  const ttl = options?.ttlSec ?? DEFAULT_TTL_SEC;
  const exp = Math.floor(Date.now() / 1000) + ttl;
  const header = { alg: "HS256", typ: "JWT" };
  const payload: WidgetTokenPayload = { stationId, exp };
  if (options?.userId) payload.userId = options.userId;

  const key = await getSigningKey(secret);
  const headerB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const message = `${headerB64}.${payloadB64}`;

  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  const sigB64 = base64UrlEncode(sig);
  return `${message}.${sigB64}`;
}

export type VerifyResult = { ok: true; payload: WidgetTokenPayload } | { ok: false; error: "invalid_token" | "token_expired" };

export async function verifyWidgetToken(secret: string, token: string): Promise<VerifyResult> {
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, error: "invalid_token" };

  const key = await getSigningKey(secret);
  const message = `${parts[0]}.${parts[1]}`;
  const sig = base64UrlDecode(parts[2]);

  const valid = await crypto.subtle.verify("HMAC", key, sig as BufferSource, new TextEncoder().encode(message));
  if (!valid) return { ok: false, error: "invalid_token" };

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1]))) as WidgetTokenPayload;
    if (!payload.stationId) return { ok: false, error: "invalid_token" };
    if (payload.exp && payload.exp < Date.now() / 1000) return { ok: false, error: "token_expired" };
    return { ok: true, payload };
  } catch {
    return { ok: false, error: "invalid_token" };
  }
}
