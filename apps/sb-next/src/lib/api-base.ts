/**
 * API base URL for catalog/search fetches. Same-origin `/api` by default.
 * Set `NEXT_PUBLIC_API_BASE_URL` when the API is hosted elsewhere.
 */
const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

export const API_BASE_URL = raw ? raw.replace(/\/$/, '') : '';

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${p}` : p;
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), init);
}
