import { describe, expect, it } from "vitest";
import { buildCoordinatorState, nextRunAt, normalizeStationSlug, tokenizeForSearch } from "@radioboss/contracts";

describe("contracts helpers", () => {
  it("normalizes station slugs", () => {
    expect(normalizeStationSlug("Bangkok Radio 99.5 FM")).toBe("bangkok-radio-99-5-fm");
  });

  it("creates coordinator state with standby mode", () => {
    expect(buildCoordinatorState("station-1")).toMatchObject({
      stationId: "station-1",
      mode: "standby",
      queue: []
    });
  });

  it("calculates daily next run timestamps", () => {
    const result = nextRunAt("2026-03-15T00:00:00.000Z", {
      kind: "daily",
      intervalMinutes: 60
    });
    expect(result).toBe("2026-03-15T01:00:00.000Z");
  });

  it("tokenizes Thai text without losing segments", () => {
    expect(tokenizeForSearch("วิทยุออนไลน์ ภาษาไทย", "th")).toContain("ภาษา");
  });
});
