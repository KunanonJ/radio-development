import { expect, test } from "@playwright/test";

const PLAYOUT_BASE = process.env.BASE_URL_PLAYOUT || "http://localhost:8080";

const skipPlayout = () => !process.env.BASE_URL_PLAYOUT;

test.describe("Playout container — health", () => {
  test.skip(skipPlayout, "Playout tests require BASE_URL_PLAYOUT (e.g. http://localhost:8080)");

  test("GET /health returns 200 and ok true", async ({ request }) => {
    const res = await request.get(PLAYOUT_BASE + "/health");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("ok", true);
    expect(body.data).toHaveProperty("service", "playout-container");
  });

  test("GET /health includes stations count in data", async ({ request }) => {
    const res = await request.get(PLAYOUT_BASE + "/health");
    const body = await res.json();
    expect(body.data).toHaveProperty("stations");
    expect(typeof body.data.stations).toBe("number");
  });
});

test.describe("Playout container — station state", () => {
  test.skip(skipPlayout);

  test("GET /stations/:id returns 200 and station data with mode and queue", async ({ request }) => {
    const res = await request.get(PLAYOUT_BASE + "/stations/demo-station");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("ok", true);
    expect(body.data).toHaveProperty("stationId", "demo-station");
    expect(body.data).toHaveProperty("mode");
    expect(body.data).toHaveProperty("queue");
    expect(Array.isArray(body.data.queue)).toBe(true);
  });
});

test.describe("Playout container — live stream", () => {
  test.skip(skipPlayout);

  test("GET /stations/:id/live returns 200 and audio/wav", async ({ request }) => {
    const res = await request.get(PLAYOUT_BASE + "/stations/demo-station/live");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("audio/wav");
    const buf = await res.body();
    expect(buf.length).toBeGreaterThan(44);
  });
});

test.describe("Playout container — 404 for unknown routes", () => {
  test.skip(skipPlayout);

  test("GET /unknown returns 404", async ({ request }) => {
    const res = await request.get(PLAYOUT_BASE + "/unknown");
    expect(res.status()).toBe(404);
  });
});
