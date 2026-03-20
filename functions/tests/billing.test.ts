import { describe, expect, it, vi } from "vitest";
import {
  buildBillingSubscription,
  buildBillingSummary,
  getPlanFromPriceId,
  mapStripeSubscriptionStatus
} from "../src/billing";

describe("billing helpers", () => {
  it("maps Stripe statuses into billing statuses", () => {
    expect(mapStripeSubscriptionStatus("active")).toBe("active");
    expect(mapStripeSubscriptionStatus("past_due")).toBe("past_due");
    expect(mapStripeSubscriptionStatus("incomplete")).toBe("incomplete");
  });

  it("builds billing summaries from station and subscription records", () => {
    const summary = buildBillingSummary({
      station: {
        id: "station_1",
        tenantId: "tenant_1",
        name: "Urban FM",
        slug: "urban-fm",
        plan: "growth",
        timezone: "Asia/Bangkok",
        status: "ready",
        createdAt: "2026-03-20T00:00:00.000Z"
      },
      subscription: buildBillingSubscription({
        station: {
          id: "station_1",
          tenantId: "tenant_1",
          name: "Urban FM",
          slug: "urban-fm",
          plan: "growth",
          timezone: "Asia/Bangkok",
          status: "ready",
          createdAt: "2026-03-20T00:00:00.000Z"
        },
        now: "2026-03-20T00:00:00.000Z",
        status: "active",
        stripeCustomerId: "cus_123",
        stripeSubscriptionId: "sub_123"
      })
    });

    expect(summary.plan).toBe("growth");
    expect(summary.status).toBe("active");
    expect(summary.billingPortalReady).toBe(true);
  });

  it("maps Stripe price IDs back to app plans", () => {
    vi.stubEnv("STRIPE_PRICE_STARTER_MONTHLY", "price_starter");
    vi.stubEnv("STRIPE_PRICE_GROWTH_MONTHLY", "price_growth");
    vi.stubEnv("STRIPE_PRICE_BROADCAST_MONTHLY", "price_broadcast");

    expect(getPlanFromPriceId("price_growth")).toBe("growth");

    vi.unstubAllEnvs();
  });
});
