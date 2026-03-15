import { expect, test } from "@playwright/test";

const API_BASE = process.env.BASE_URL_API || "http://localhost:8787";

const skipApi = () => !process.env.BASE_URL_API;

test.describe("Control API — health", () => {
  test.skip(skipApi, "API tests require BASE_URL_API (e.g. http://localhost:8787)");

  test("GET /health returns 200 and ok true", async ({ request }) => {
    const res = await request.get(API_BASE + "/health");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("ok", true);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("service", "control-api");
  });

  test("GET /health includes env and stationDbMode in data", async ({ request }) => {
    const res = await request.get(API_BASE + "/health");
    const body = await res.json();
    expect(body.data).toHaveProperty("env");
    expect(body.data).toHaveProperty("stationDbMode");
  });
});

test.describe("Control API — validate-widget", () => {
  test.skip(skipApi);

  test("GET /v1/validate-widget without token returns 400", async ({ request }) => {
    const res = await request.get(API_BASE + "/v1/validate-widget");
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty("ok", false);
    expect(body).toHaveProperty("error");
  });

  test("GET /v1/validate-widget?token=invalid returns 401 and error invalid_token or token_expired", async ({
    request
  }) => {
    const res = await request.get(API_BASE + "/v1/validate-widget?token=invalid.fake.token");
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty("ok", false);
    expect(["invalid_token", "token_expired"]).toContain(body.error);
  });

  test("GET /v1/validate-widget?token= with empty token returns 400", async ({ request }) => {
    const res = await request.get(API_BASE + "/v1/validate-widget?token=");
    expect(res.status()).toBe(400);
  });
});

test.describe("Control API — tenants and stations (optional, no auth in dev)", () => {
  test.skip(skipApi);

  test("GET /v1/tenants returns 200 and data array", async ({ request }) => {
    const res = await request.get(API_BASE + "/v1/tenants");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("ok", true);
    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("GET /v1/stations returns 200 and data array", async ({ request }) => {
    const res = await request.get(API_BASE + "/v1/stations");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("ok", true);
    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBe(true);
  });
});
