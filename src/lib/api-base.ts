/**
 * Base URL for same-origin Pages Functions (`/api/*`).
 * Override in Cloudflare Pages env: `VITE_API_BASE_URL` (e.g. absolute URL if API is split later).
 */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (raw != null && raw !== "") {
    return raw.replace(/\/$/, "");
  }
  return "";
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** Same-origin fetch that sends session cookies (`sb_session`) for `/api/*`. */
export function apiFetch(input: string | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, { credentials: 'same-origin', ...init });
}
