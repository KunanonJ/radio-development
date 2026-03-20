import { describe, expect, it } from "vitest";
import { dashboardSnapshot } from "../packages/contracts/src/index";

describe("dashboardSnapshot", () => {
  it("exposes seeded metrics for the web shell", () => {
    expect(dashboardSnapshot.listeners).toBeGreaterThan(0);
    expect(dashboardSnapshot.stations).toBeGreaterThan(0);
  });
});
