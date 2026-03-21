import type {
  BillingSummary,
  CloudStationView,
  CreateBillingPortalSessionInput,
  CreateBillingPortalSessionResponse,
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResponse,
  CreateMediaAssetInput,
  CreatePlaylistInput,
  CreateRecordingJobInput,
  CreateRelayInput,
  CreateScheduleEventInput,
  DashboardSummary,
  MediaAssetPage,
  PlaybackSettings,
  ProvisionStationInput,
  ProvisionStationResponse,
  Station,
  UpdatePlaybackSettingsInput
} from "@the-urban-radio/contracts";
import { firebaseAuth, getFunctionsBaseUrl, waitForAuthReady } from "./firebase/client";

const getAuthToken = async () => {
  const user = firebaseAuth.currentUser ?? (await waitForAuthReady());
  if (!user) {
    throw new Error("You must sign in before using the control plane.");
  }

  return user.getIdToken();
};

const authedFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const token = await getAuthToken();
  const response = await fetch(`${getFunctionsBaseUrl()}/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {})
    }
  });

  const payload: unknown = await response.json();
  if (!response.ok) {
    if (payload && typeof payload === "object" && "error" in payload) {
      throw new Error(String((payload as { error: unknown }).error));
    }

    throw new Error("Request failed.");
  }

  return payload as T;
};

export const provisionStation = (input: ProvisionStationInput) =>
  authedFetch<ProvisionStationResponse>("provisionStation", {
    method: "POST",
    body: JSON.stringify(input)
  });

export const getStations = async (tenantId?: string) => {
  const params = new URLSearchParams();
  if (tenantId) {
    params.set("tenantId", tenantId);
  }

  const path = params.size > 0 ? `stations?${params.toString()}` : "stations";
  const response = await authedFetch<{ stations: Station[] }>(path);
  return response.stations;
};

export const getDashboardSummary = (stationId: string) =>
  authedFetch<DashboardSummary>(`dashboardSummary?stationId=${encodeURIComponent(stationId)}`);

export const getStationDetail = (stationId: string) =>
  authedFetch<CloudStationView>(`stationDetail?stationId=${encodeURIComponent(stationId)}`);

export const getMediaAssets = (stationId: string, cursor?: string | null, limit = 25) => {
  const params = new URLSearchParams({
    stationId,
    limit: String(limit)
  });

  if (cursor) {
    params.set("cursor", cursor);
  }

  return authedFetch<MediaAssetPage>(`mediaAssets?${params.toString()}`);
};

export const createMediaAsset = (input: CreateMediaAssetInput) =>
  authedFetch("mediaAssets", {
    method: "POST",
    body: JSON.stringify(input)
  });

export const createPlaylist = (input: CreatePlaylistInput) =>
  authedFetch("playlists", {
    method: "POST",
    body: JSON.stringify(input)
  });

export const createScheduleEvent = (input: CreateScheduleEventInput) =>
  authedFetch("scheduleEvents", {
    method: "POST",
    body: JSON.stringify(input)
  });

export const createRelay = (input: CreateRelayInput) =>
  authedFetch("relays", {
    method: "POST",
    body: JSON.stringify(input)
  });

export const createRecordingJob = (input: CreateRecordingJobInput) =>
  authedFetch("recordingJobs", {
    method: "POST",
    body: JSON.stringify(input)
  });

export const getBillingSummary = (stationId: string) =>
  authedFetch<BillingSummary>(`billingSummary?stationId=${encodeURIComponent(stationId)}`);

export const createCheckoutSession = (input: CreateCheckoutSessionInput) =>
  authedFetch<CreateCheckoutSessionResponse>("createCheckoutSession", {
    method: "POST",
    body: JSON.stringify(input)
  });

export const createBillingPortalSession = (input: CreateBillingPortalSessionInput) =>
  authedFetch<CreateBillingPortalSessionResponse>("createBillingPortalSession", {
    method: "POST",
    body: JSON.stringify(input)
  });

export const getPlaybackSettings = (stationId: string) =>
  authedFetch<PlaybackSettings>(`playbackSettings?stationId=${encodeURIComponent(stationId)}`);

export const updatePlaybackSettings = (input: UpdatePlaybackSettingsInput) =>
  authedFetch<PlaybackSettings>("playbackSettings", {
    method: "POST",
    body: JSON.stringify(input)
  });
