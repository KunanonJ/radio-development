import { describe, expect, it } from "vitest";
import {
  buildDashboardSummary,
  buildDefaultPlaybackSettings,
  validateCreateScheduleEventInput,
  validateUpdatePlaybackSettingsInput
} from "../src/control-plane";

describe("validateCreateScheduleEventInput", () => {
  it("accepts valid schedule actions", () => {
    const parsed = validateCreateScheduleEventInput({
      stationId: "station_1",
      action: "relay_start",
      title: "Thai Relay Window",
      startsAt: "2026-03-20T01:00:00.000Z"
    });

    expect(parsed.action).toBe("relay_start");
  });

  it("rejects unknown schedule actions", () => {
    expect(() =>
      validateCreateScheduleEventInput({
        stationId: "station_1",
        action: "unknown",
        title: "Bad Event",
        startsAt: "2026-03-20T01:00:00.000Z"
      })
    ).toThrow("action is invalid.");
  });
});

describe("buildDashboardSummary", () => {
  it("computes counts and preserves latest worker state", () => {
    const summary = buildDashboardSummary({
      station: {
        id: "station_1",
        tenantId: "tenant_1",
        name: "Urban Thai FM",
        slug: "urban-thai-fm",
        plan: "growth",
        timezone: "Asia/Bangkok",
        status: "ready",
        createdAt: "2026-03-20T00:00:00.000Z"
      },
      library: {
        id: "station_1",
        stationId: "station_1",
        ownerUserId: "user_1",
        totalAssets: 1,
        maxAssets: 1_000_000,
        newestAssetAt: "2026-03-20T00:00:00.000Z",
        createdAt: "2026-03-20T00:00:00.000Z",
        updatedAt: "2026-03-20T00:00:00.000Z"
      },
      playbackSettings: buildDefaultPlaybackSettings({
        stationId: "station_1",
        updatedAt: "2026-03-20T00:00:00.000Z",
        updatedBy: "user_1"
      }),
      playlists: [],
      scheduleEvents: [],
      relays: [],
      recordingJobs: [],
      commands: [
        {
          id: "command_1",
          stationId: "station_1",
          type: "queue.refresh",
          status: "completed",
          createdAt: "2026-03-20T00:01:00.000Z",
          payload: { title: "Morning Queue" }
        }
      ],
      workerStatuses: [
        {
          id: "automation_station_1",
          workerName: "automation",
          stationId: "station_1",
          health: "healthy",
          lastSeenAt: "2026-03-20T00:02:00.000Z",
          lastCommandId: "command_1"
        }
      ]
    });

    expect(summary.library.totalAssets).toBe(1);
    expect(summary.latestCommand?.type).toBe("queue.refresh");
    expect(summary.latestWorkerStatus?.health).toBe("healthy");
  });
});

describe("validateUpdatePlaybackSettingsInput", () => {
  it("accepts valid playback settings payloads", () => {
    const parsed = validateUpdatePlaybackSettingsInput({
      stationId: "station_1",
      transitionsEnabled: true,
      transitionStyle: "automix",
      soundEnhancerEnabled: true,
      soundEnhancerLevel: 50,
      soundCheckEnabled: true,
      losslessAudioEnabled: true,
      streamingLosslessQuality: "hi_res_lossless",
      downloadLosslessQuality: "hi_res_lossless",
      spatialAudioMode: "always_on",
      hdmiPassthroughMode: "prefer",
      videoStreamingQuality: "best_4k",
      videoDownloadQuality: "up_to_hd"
    });

    expect(parsed.transitionStyle).toBe("automix");
    expect(parsed.soundEnhancerLevel).toBe(50);
  });
});
