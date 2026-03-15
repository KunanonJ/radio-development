import type { ApiEnvelope } from "@radioboss/contracts";

export function json<T>(payload: ApiEnvelope<T> | T, init?: ResponseInit): Response {
  return Response.json(payload, {
    headers: {
      "cache-control": "no-store"
    },
    ...init
  });
}

export async function readJson<T>(request: Request): Promise<T> {
  return (await request.json()) as T;
}

export function notFound(resource = "resource"): Response {
  return json({ ok: false, error: `${resource} not found` }, { status: 404 });
}

export function badRequest(message: string): Response {
  return json({ ok: false, error: message }, { status: 400 });
}
