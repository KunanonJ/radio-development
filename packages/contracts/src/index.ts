export const SUPPORTED_LOCALES = ["en", "th"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const SUBSCRIPTION_PLANS = ["starter", "growth", "broadcast"] as const;
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

export const USER_ROLES = ["owner", "programmer", "dj", "support", "viewer"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const STATION_MODES = ["autodj", "live", "standby"] as const;
export type StationMode = (typeof STATION_MODES)[number];

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  locale: Locale;
  plan: SubscriptionPlan;
  createdAt: string;
}

export interface Station {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  timezone: string;
  locale: Locale;
  mode: StationMode;
  streamKey: string;
  stationDbKey: string;
  createdAt: string;
}

export interface Playlist {
  id: string;
  stationId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleRecurrence {
  kind: "once" | "daily" | "weekly";
  daysOfWeek?: number[];
  intervalMinutes?: number;
}

export interface ScheduleEvent {
  id: string;
  stationId: string;
  name: string;
  startAt: string;
  recurrence: ScheduleRecurrence;
  targetPlaylistId?: string;
  action: "enqueue_playlist" | "switch_mode" | "run_relay";
}

export interface WidgetConfig {
  id: string;
  stationId: string;
  kind: "player" | "now_playing" | "recent_tracks";
  theme: "cloud" | "midnight" | "sunrise";
  locale: Locale;
}

export interface CoordinatorState {
  stationId: string;
  mode: StationMode;
  queue: string[];
  currentTrack?: string;
  upcomingTrack?: string;
  updatedAt: string;
}

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: string;
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export const nowIso = () => new Date().toISOString();

export function normalizeLocale(input?: string | null): Locale {
  return input === "th" ? "th" : "en";
}

export function normalizeStationSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function buildCoordinatorState(stationId: string, mode: StationMode = "standby"): CoordinatorState {
  return {
    stationId,
    mode,
    queue: [],
    updatedAt: nowIso()
  };
}

export function nextRunAt(startAt: string, recurrence: ScheduleRecurrence): string {
  const start = new Date(startAt);
  if (recurrence.kind === "once") {
    return start.toISOString();
  }

  if (recurrence.kind === "daily") {
    const interval = recurrence.intervalMinutes ?? 24 * 60;
    return new Date(start.getTime() + interval * 60_000).toISOString();
  }

  const days = recurrence.daysOfWeek?.length ? recurrence.daysOfWeek : [start.getUTCDay()];
  for (let offset = 1; offset <= 7; offset += 1) {
    const candidate = new Date(start.getTime() + offset * 24 * 60 * 60_000);
    if (days.includes(candidate.getUTCDay())) {
      return candidate.toISOString();
    }
  }

  return new Date(start.getTime() + 7 * 24 * 60 * 60_000).toISOString();
}

export function tokenizeForSearch(input: string, locale: Locale = "en"): string[] {
  const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
  return [...segmenter.segment(input)]
    .map((entry) => entry.segment.trim().toLowerCase())
    .filter((entry) => entry.length > 0);
}
