import { describe, expect, it } from "vitest";
import {
  buildMediaAsset,
  buildMediaAssetPage,
  buildStationLibrarySummary
} from "../src/control-plane";

describe("large library foundations", () => {
  it("builds station library summaries with a 1,000,000 asset cap", () => {
    const summary = buildStationLibrarySummary({
      id: "station_1",
      stationId: "station_1",
      ownerUserId: "user_1",
      createdAt: "2026-03-20T00:00:00.000Z"
    });

    expect(summary.totalAssets).toBe(0);
    expect(summary.maxAssets).toBe(1_000_000);
  });

  it("tracks the creating user on media assets", () => {
    const asset = buildMediaAsset(
      "asset_1",
      {
        stationId: "station_1",
        title: "Bangkok Nights",
        artist: "The Urban Radio",
        language: "th",
        durationSeconds: 240,
        tags: ["thai"]
      },
      "2026-03-20T00:00:00.000Z",
      "user_1"
    );

    expect(asset.createdBy).toBe("user_1");
  });

  it("builds paginated media responses from a station summary", () => {
    const summary = buildStationLibrarySummary({
      id: "station_1",
      stationId: "station_1",
      ownerUserId: "user_1",
      createdAt: "2026-03-20T00:00:00.000Z"
    });

    const page = buildMediaAssetPage({
      items: [],
      summary: {
        ...summary,
        totalAssets: 250000
      },
      nextCursor: "asset_25"
    });

    expect(page.totalAssets).toBe(250000);
    expect(page.nextCursor).toBe("asset_25");
  });
});
