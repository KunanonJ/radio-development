import type {
  AuditLogEntry,
  CloudStationView,
  CreateMediaAssetInput,
  CreatePlaylistInput,
  CreateRecordingJobInput,
  CreateRelayInput,
  CreateScheduleEventInput,
  DashboardSummary,
  MediaAsset,
  MediaAssetPage,
  Playlist,
  PlaybackSettings,
  RecordingJob,
  Relay,
  ReportJob,
  ScheduleEvent,
  Station,
  StationLibrarySummary,
  UpdatePlaybackSettingsInput,
  WidgetConfig,
  WorkerCommand,
  WorkerCommandType,
  WorkerStatus
} from "@the-urban-radio/contracts";
import { ProvisioningError } from "./provisioning";

const asObject = (body: unknown) => {
  if (!body || typeof body !== "object") {
    throw new ProvisioningError("Request body must be a JSON object.", 400);
  }

  return body as Record<string, unknown>;
};

const requireString = (raw: Record<string, unknown>, key: string) => {
  const value = String(raw[key] ?? "").trim();
  if (!value) {
    throw new ProvisioningError(`${key} is required.`, 400);
  }

  return value;
};

const optionalStringArray = (raw: Record<string, unknown>, key: string) => {
  const value = raw[key];
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item).trim()).filter(Boolean);
};

export const validateCreateMediaAssetInput = (body: unknown): CreateMediaAssetInput => {
  const raw = asObject(body);
  return {
    stationId: requireString(raw, "stationId"),
    title: requireString(raw, "title"),
    artist: requireString(raw, "artist"),
    language: requireString(raw, "language"),
    durationSeconds: Number(raw.durationSeconds ?? 0),
    tags: optionalStringArray(raw, "tags")
  };
};

export const validateCreatePlaylistInput = (body: unknown): CreatePlaylistInput => {
  const raw = asObject(body);
  return {
    stationId: requireString(raw, "stationId"),
    name: requireString(raw, "name"),
    locale: requireString(raw, "locale")
  };
};

export const validateCreateScheduleEventInput = (body: unknown): CreateScheduleEventInput => {
  const raw = asObject(body);
  const action = requireString(raw, "action") as CreateScheduleEventInput["action"];
  if (!["playout", "relay_start", "relay_stop", "record_start", "record_stop"].includes(action)) {
    throw new ProvisioningError("action is invalid.", 400);
  }

  return {
    stationId: requireString(raw, "stationId"),
    action,
    title: requireString(raw, "title"),
    startsAt: requireString(raw, "startsAt")
  };
};

export const validateCreateRelayInput = (body: unknown): CreateRelayInput => {
  const raw = asObject(body);
  return {
    stationId: requireString(raw, "stationId"),
    name: requireString(raw, "name"),
    sourceUrl: requireString(raw, "sourceUrl")
  };
};

export const validateCreateRecordingJobInput = (body: unknown): CreateRecordingJobInput => {
  const raw = asObject(body);
  return {
    stationId: requireString(raw, "stationId"),
    name: requireString(raw, "name")
  };
};

export const validateUpdatePlaybackSettingsInput = (body: unknown): UpdatePlaybackSettingsInput => {
  const raw = asObject(body);
  const transitionStyle = requireString(raw, "transitionStyle") as UpdatePlaybackSettingsInput["transitionStyle"];
  const streamingLosslessQuality = requireString(
    raw,
    "streamingLosslessQuality"
  ) as UpdatePlaybackSettingsInput["streamingLosslessQuality"];
  const downloadLosslessQuality = requireString(
    raw,
    "downloadLosslessQuality"
  ) as UpdatePlaybackSettingsInput["downloadLosslessQuality"];
  const spatialAudioMode = requireString(raw, "spatialAudioMode") as UpdatePlaybackSettingsInput["spatialAudioMode"];
  const hdmiPassthroughMode = requireString(
    raw,
    "hdmiPassthroughMode"
  ) as UpdatePlaybackSettingsInput["hdmiPassthroughMode"];
  const videoStreamingQuality = requireString(
    raw,
    "videoStreamingQuality"
  ) as UpdatePlaybackSettingsInput["videoStreamingQuality"];
  const videoDownloadQuality = requireString(
    raw,
    "videoDownloadQuality"
  ) as UpdatePlaybackSettingsInput["videoDownloadQuality"];

  if (!["automix", "crossfade", "cut"].includes(transitionStyle)) {
    throw new ProvisioningError("transitionStyle is invalid.", 400);
  }

  if (!["lossless", "hi_res_lossless"].includes(streamingLosslessQuality)) {
    throw new ProvisioningError("streamingLosslessQuality is invalid.", 400);
  }

  if (!["lossless", "hi_res_lossless"].includes(downloadLosslessQuality)) {
    throw new ProvisioningError("downloadLosslessQuality is invalid.", 400);
  }

  if (!["automatic", "always_on", "off"].includes(spatialAudioMode)) {
    throw new ProvisioningError("spatialAudioMode is invalid.", 400);
  }

  if (!["prefer", "never"].includes(hdmiPassthroughMode)) {
    throw new ProvisioningError("hdmiPassthroughMode is invalid.", 400);
  }

  if (!["best_4k", "up_to_hd"].includes(videoStreamingQuality)) {
    throw new ProvisioningError("videoStreamingQuality is invalid.", 400);
  }

  if (!["best_4k", "up_to_hd"].includes(videoDownloadQuality)) {
    throw new ProvisioningError("videoDownloadQuality is invalid.", 400);
  }

  const soundEnhancerLevel = Number(raw.soundEnhancerLevel ?? 50);
  if (!Number.isFinite(soundEnhancerLevel) || soundEnhancerLevel < 0 || soundEnhancerLevel > 100) {
    throw new ProvisioningError("soundEnhancerLevel must be between 0 and 100.", 400);
  }

  return {
    stationId: requireString(raw, "stationId"),
    transitionsEnabled: Boolean(raw.transitionsEnabled),
    transitionStyle,
    soundEnhancerEnabled: Boolean(raw.soundEnhancerEnabled),
    soundEnhancerLevel: Math.round(soundEnhancerLevel),
    soundCheckEnabled: Boolean(raw.soundCheckEnabled),
    losslessAudioEnabled: Boolean(raw.losslessAudioEnabled),
    streamingLosslessQuality,
    downloadLosslessQuality,
    spatialAudioMode,
    hdmiPassthroughMode,
    videoStreamingQuality,
    videoDownloadQuality
  };
};

export const buildMediaAsset = (
  id: string,
  input: CreateMediaAssetInput,
  now: string,
  createdBy: string
): MediaAsset => ({
  id,
  stationId: input.stationId,
  createdBy,
  title: input.title,
  artist: input.artist,
  language: input.language,
  durationSeconds: input.durationSeconds,
  tags: input.tags ?? [],
  createdAt: now
});

export const buildPlaylist = (id: string, input: CreatePlaylistInput, now: string): Playlist => ({
  id,
  stationId: input.stationId,
  name: input.name,
  locale: input.locale,
  createdAt: now
});

export const buildScheduleEvent = (
  id: string,
  input: CreateScheduleEventInput,
  now: string
): ScheduleEvent => ({
  id,
  stationId: input.stationId,
  action: input.action,
  title: input.title,
  startsAt: input.startsAt,
  createdAt: now
});

export const buildRelay = (id: string, input: CreateRelayInput, now: string): Relay => ({
  id,
  stationId: input.stationId,
  name: input.name,
  sourceUrl: input.sourceUrl,
  status: "idle",
  createdAt: now
});

export const buildRecordingJob = (
  id: string,
  input: CreateRecordingJobInput,
  now: string
): RecordingJob => ({
  id,
  stationId: input.stationId,
  name: input.name,
  status: "queued",
  createdAt: now
});

export const buildReportJob = (id: string, stationId: string, now: string): ReportJob => ({
  id,
  stationId,
  name: "Station Summary Report",
  format: "pdf",
  status: "queued",
  createdAt: now
});

export const buildWidgetConfig = (id: string, stationId: string, locale: string, now: string): WidgetConfig => ({
  id,
  stationId,
  locale,
  theme: "urban-light",
  showArtwork: true,
  createdAt: now
});

export const buildStationLibrarySummary = (args: {
  id: string;
  stationId: string;
  ownerUserId: string;
  createdAt: string;
}): StationLibrarySummary => ({
  id: args.id,
  stationId: args.stationId,
  ownerUserId: args.ownerUserId,
  totalAssets: 0,
  maxAssets: 1_000_000,
  createdAt: args.createdAt,
  updatedAt: args.createdAt
});

export const buildDefaultPlaybackSettings = (args: {
  stationId: string;
  updatedAt: string;
  updatedBy: string;
}): PlaybackSettings => ({
  id: args.stationId,
  stationId: args.stationId,
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
  videoDownloadQuality: "up_to_hd",
  updatedAt: args.updatedAt,
  updatedBy: args.updatedBy
});

export const buildPlaybackSettings = (args: {
  input: UpdatePlaybackSettingsInput;
  updatedAt: string;
  updatedBy: string;
}): PlaybackSettings => ({
  id: args.input.stationId,
  stationId: args.input.stationId,
  transitionsEnabled: args.input.transitionsEnabled,
  transitionStyle: args.input.transitionStyle,
  soundEnhancerEnabled: args.input.soundEnhancerEnabled,
  soundEnhancerLevel: args.input.soundEnhancerLevel,
  soundCheckEnabled: args.input.soundCheckEnabled,
  losslessAudioEnabled: args.input.losslessAudioEnabled,
  streamingLosslessQuality: args.input.streamingLosslessQuality,
  downloadLosslessQuality: args.input.downloadLosslessQuality,
  spatialAudioMode: args.input.spatialAudioMode,
  hdmiPassthroughMode: args.input.hdmiPassthroughMode,
  videoStreamingQuality: args.input.videoStreamingQuality,
  videoDownloadQuality: args.input.videoDownloadQuality,
  updatedAt: args.updatedAt,
  updatedBy: args.updatedBy
});

export const buildWorkerCommand = (args: {
  id: string;
  stationId: string;
  type: WorkerCommandType;
  createdAt: string;
  payload?: WorkerCommand["payload"];
}): WorkerCommand => ({
  id: args.id,
  stationId: args.stationId,
  type: args.type,
  status: "pending",
  createdAt: args.createdAt,
  payload: args.payload ?? {}
});

export const buildAuditLog = (args: {
  id: string;
  type: AuditLogEntry["type"];
  tenantId: string;
  stationId: string;
  createdAt: string;
  createdBy: string;
  metadata?: Record<string, string>;
}): AuditLogEntry => ({
  id: args.id,
  type: args.type,
  tenantId: args.tenantId,
  stationId: args.stationId,
  createdAt: args.createdAt,
  createdBy: args.createdBy,
  metadata: args.metadata
});

export const buildDashboardSummary = (args: {
  station: Station;
  library: StationLibrarySummary | null;
  playlists: Playlist[];
  scheduleEvents: ScheduleEvent[];
  relays: Relay[];
  recordingJobs: RecordingJob[];
  commands: WorkerCommand[];
  workerStatuses: WorkerStatus[];
}): DashboardSummary => ({
  stationId: args.station.id,
  stationName: args.station.name,
  status: args.station.status,
  library:
    args.library ?? {
      id: args.station.id,
      stationId: args.station.id,
      ownerUserId: "",
      totalAssets: 0,
      maxAssets: 1_000_000,
      createdAt: args.station.createdAt,
      updatedAt: args.station.createdAt
    },
  counts: {
    playlists: args.playlists.length,
    scheduleEvents: args.scheduleEvents.length,
    relays: args.relays.length,
    recordingJobs: args.recordingJobs.length,
    commands: args.commands.length
  },
  latestWorkerStatus: args.workerStatuses[0] ?? null,
  latestCommand: args.commands[0] ?? null
});

export const buildStationView = (args: {
  station: Station;
  library: StationLibrarySummary | null;
  playbackSettings: PlaybackSettings | null;
  playlists: Playlist[];
  scheduleEvents: ScheduleEvent[];
  relays: Relay[];
  recordingJobs: RecordingJob[];
  commands: WorkerCommand[];
  workerStatuses: WorkerStatus[];
}): CloudStationView => ({
  station: args.station,
  library: args.library,
  playbackSettings: args.playbackSettings,
  playlists: args.playlists,
  scheduleEvents: args.scheduleEvents,
  relays: args.relays,
  recordingJobs: args.recordingJobs,
  commands: args.commands,
  workerStatuses: args.workerStatuses
});

export const buildMediaAssetPage = (args: {
  items: MediaAsset[];
  summary: StationLibrarySummary | null;
  nextCursor: string | null;
}): MediaAssetPage => ({
  items: args.items,
  nextCursor: args.nextCursor,
  totalAssets: args.summary?.totalAssets ?? args.items.length,
  maxAssets: args.summary?.maxAssets ?? 1_000_000
});
