export type StationPlan = "starter" | "growth" | "broadcast";
export type TenantRole = "owner" | "admin" | "operator" | "viewer";
export type StationStatus = "provisioning" | "ready" | "degraded";
export type RelayStatus = "idle" | "active" | "error";
export type RecordingJobStatus = "queued" | "running" | "completed" | "failed";
export type ReportJobStatus = "queued" | "processing" | "completed" | "failed";
export type BillingPlan = StationPlan;
export type TransitionStyle = "automix" | "crossfade" | "cut";
export type LosslessQuality = "lossless" | "hi_res_lossless";
export type SpatialAudioMode = "automatic" | "always_on" | "off";
export type HdmiPassthroughMode = "prefer" | "never";
export type VideoQuality = "best_4k" | "up_to_hd";
export type BillingSubscriptionStatus =
  | "none"
  | "incomplete"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused";
export type WorkerCommandType =
  | "station.provision"
  | "queue.refresh"
  | "relay.start"
  | "relay.stop"
  | "recording.start"
  | "recording.stop"
  | "report.generate"
  | "index.sync";
export type WorkerCommandStatus = "pending" | "processing" | "completed" | "failed";

export interface Tenant {
  id: string;
  name: string;
  locale: string;
  createdAt: string;
  createdBy: string;
}

export interface TenantMembership {
  id: string;
  tenantId: string;
  userId: string;
  email: string;
  role: TenantRole;
  createdAt: string;
  createdBy: string;
}

export interface Station {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  plan: StationPlan;
  timezone: string;
  status: StationStatus;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  stationId: string;
  createdBy: string;
  title: string;
  artist: string;
  language: string;
  durationSeconds: number;
  tags: string[];
  createdAt: string;
}

export interface StationLibrarySummary {
  id: string;
  stationId: string;
  ownerUserId: string;
  totalAssets: number;
  maxAssets: number;
  newestAssetAt?: string;
  lastIndexedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaybackSettings {
  id: string;
  stationId: string;
  transitionsEnabled: boolean;
  transitionStyle: TransitionStyle;
  soundEnhancerEnabled: boolean;
  soundEnhancerLevel: number;
  soundCheckEnabled: boolean;
  losslessAudioEnabled: boolean;
  streamingLosslessQuality: LosslessQuality;
  downloadLosslessQuality: LosslessQuality;
  spatialAudioMode: SpatialAudioMode;
  hdmiPassthroughMode: HdmiPassthroughMode;
  videoStreamingQuality: VideoQuality;
  videoDownloadQuality: VideoQuality;
  updatedAt: string;
  updatedBy: string;
}

export interface Category {
  id: string;
  stationId: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Rotation {
  id: string;
  stationId: string;
  name: string;
  categoryIds: string[];
  repeatWindowMinutes: number;
  createdAt: string;
}

export interface Playlist {
  id: string;
  stationId: string;
  name: string;
  locale: string;
  createdAt: string;
}

export interface PlaylistItem {
  id: string;
  stationId: string;
  playlistId: string;
  assetId: string;
  position: number;
  title: string;
  artist: string;
  createdAt: string;
}

export interface ScheduleEvent {
  id: string;
  stationId: string;
  action: "playout" | "relay_start" | "relay_stop" | "record_start" | "record_stop";
  title: string;
  startsAt: string;
  createdAt: string;
}

export interface Relay {
  id: string;
  stationId: string;
  name: string;
  sourceUrl: string;
  status: RelayStatus;
  createdAt: string;
}

export interface RecordingJob {
  id: string;
  stationId: string;
  name: string;
  status: RecordingJobStatus;
  startedAt?: string;
  createdAt: string;
}

export interface ReportJob {
  id: string;
  stationId: string;
  name: string;
  format: "pdf" | "xlsx";
  status: ReportJobStatus;
  createdAt: string;
}

export interface WidgetConfig {
  id: string;
  stationId: string;
  locale: string;
  theme: "urban-light" | "urban-dark";
  showArtwork: boolean;
  createdAt: string;
}

export interface WidgetPayload {
  stationId: string;
  title: string;
  artist: string;
  listeners: number;
  locale: string;
}

export interface BillingAccount {
  id: string;
  tenantId: string;
  defaultStationId: string;
  createdBy: string;
  email: string;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingSubscription {
  id: string;
  tenantId: string;
  stationId: string;
  plan: BillingPlan;
  status: BillingSubscriptionStatus;
  stripeCustomerId?: string;
  stripePriceId?: string;
  stripeSubscriptionId?: string;
  stripeCheckoutSessionId?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillingSummary {
  tenantId: string;
  stationId: string;
  plan: BillingPlan;
  status: BillingSubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  checkoutReady: boolean;
  billingPortalReady: boolean;
}

export interface WorkerCommand {
  id: string;
  stationId: string;
  type: WorkerCommandType;
  status: WorkerCommandStatus;
  createdAt: string;
  processingStartedAt?: string;
  completedAt?: string;
  payload: {
    tenantId?: string;
    tenantName?: string;
    stationName?: string;
    stationSlug?: string;
    plan?: StationPlan;
    timezone?: string;
    title?: string;
    relayId?: string;
    recordingJobId?: string;
    reportJobId?: string;
    widgetConfigId?: string;
  };
}

export interface WorkerStatus {
  id: string;
  workerName: string;
  stationId: string;
  health: "healthy" | "busy" | "error";
  lastSeenAt: string;
  lastCommandId?: string;
}

export interface AuditLogEntry {
  id: string;
  type:
    | "station.provision.requested"
    | "media.asset.created"
    | "playlist.created"
    | "schedule-event.created"
    | "relay.created"
    | "recording-job.created";
  tenantId: string;
  stationId: string;
  createdAt: string;
  createdBy: string;
  metadata?: Record<string, string>;
}

export interface DashboardSummary {
  stationId: string;
  stationName: string;
  status: StationStatus;
  library: StationLibrarySummary;
  counts: {
    playlists: number;
    scheduleEvents: number;
    relays: number;
    recordingJobs: number;
    commands: number;
  };
  latestWorkerStatus: WorkerStatus | null;
  latestCommand: WorkerCommand | null;
}

export interface CloudStationView {
  station: Station;
  library: StationLibrarySummary | null;
  playbackSettings: PlaybackSettings | null;
  playlists: Playlist[];
  scheduleEvents: ScheduleEvent[];
  relays: Relay[];
  recordingJobs: RecordingJob[];
  commands: WorkerCommand[];
  workerStatuses: WorkerStatus[];
}

export interface ProvisionStationInput {
  tenantName: string;
  stationName: string;
  locale: string;
  timezone: string;
  plan: StationPlan;
}

export interface ProvisionStationResponse {
  tenant: Tenant;
  station: Station;
  command: WorkerCommand;
}

export interface CreateMediaAssetInput {
  stationId: string;
  title: string;
  artist: string;
  language: string;
  durationSeconds: number;
  tags?: string[];
}

export interface MediaAssetPage {
  items: MediaAsset[];
  nextCursor: string | null;
  totalAssets: number;
  maxAssets: number;
}

export interface UpdatePlaybackSettingsInput {
  stationId: string;
  transitionsEnabled: boolean;
  transitionStyle: TransitionStyle;
  soundEnhancerEnabled: boolean;
  soundEnhancerLevel: number;
  soundCheckEnabled: boolean;
  losslessAudioEnabled: boolean;
  streamingLosslessQuality: LosslessQuality;
  downloadLosslessQuality: LosslessQuality;
  spatialAudioMode: SpatialAudioMode;
  hdmiPassthroughMode: HdmiPassthroughMode;
  videoStreamingQuality: VideoQuality;
  videoDownloadQuality: VideoQuality;
}

export interface CreatePlaylistInput {
  stationId: string;
  name: string;
  locale: string;
}

export interface CreateScheduleEventInput {
  stationId: string;
  action: ScheduleEvent["action"];
  title: string;
  startsAt: string;
}

export interface CreateRelayInput {
  stationId: string;
  name: string;
  sourceUrl: string;
}

export interface CreateRecordingJobInput {
  stationId: string;
  name: string;
}

export interface CreateCheckoutSessionInput {
  stationId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreateCheckoutSessionResponse {
  url: string;
  sessionId: string;
  customerId: string;
}

export interface CreateBillingPortalSessionInput {
  stationId: string;
  returnUrl?: string;
}

export interface CreateBillingPortalSessionResponse {
  url: string;
}

export const buildStationSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

export const dashboardSnapshot = {
  stations: 12,
  scheduledEvents: 186,
  relays: 9,
  archiveJobs: 24,
  listeners: 482
} as const;
