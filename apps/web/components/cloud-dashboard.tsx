"use client";

import type {
  CloudStationView,
  DashboardSummary,
  MediaAsset,
  MediaAssetPage,
  PlaybackSettings,
  Station
} from "@the-urban-radio/contracts";
import { useEffect, useState, useTransition } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { AppShell, MetricGrid } from "@the-urban-radio/ui";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firebaseAuth, firestore } from "../lib/firebase/client";
import {
  createMediaAsset,
  createPlaylist,
  createRecordingJob,
  createRelay,
  createScheduleEvent,
  getDashboardSummary,
  getMediaAssets,
  getPlaybackSettings,
  getStationDetail,
  updatePlaybackSettings
} from "../lib/control-plane-api";

export const CloudDashboard = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStationId, setSelectedStationId] = useState("");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [detail, setDetail] = useState<CloudStationView | null>(null);
  const [mediaPage, setMediaPage] = useState<MediaAssetPage | null>(null);
  const [playbackSettings, setPlaybackSettings] = useState<PlaybackSettings | null>(null);
  const [settingsTab, setSettingsTab] = useState<"general" | "playback" | "files" | "advanced">("playback");
  const [loadingMoreMedia, setLoadingMoreMedia] = useState(false);
  const [savingPlaybackSettings, setSavingPlaybackSettings] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => {
      if (!user) {
        setStations([]);
        setSelectedStationId("");
        setSummary(null);
        setDetail(null);
        setMediaPage(null);
        setPlaybackSettings(null);
        return;
      }

      const stationQuery = query(collection(firestore, "stations"), orderBy("createdAt", "desc"));
      return onSnapshot(stationQuery, (snapshot) => {
        const nextStations = snapshot.docs.map((doc) => doc.data() as Station);
        setStations(nextStations);
        setSelectedStationId((current) => current || nextStations[0]?.id || "");
      });
    });
  }, []);

  useEffect(() => {
    if (!selectedStationId) {
      return;
    }

    startTransition(() => {
      Promise.all([
        getDashboardSummary(selectedStationId),
        getStationDetail(selectedStationId),
        getMediaAssets(selectedStationId),
        getPlaybackSettings(selectedStationId)
      ])
        .then(([nextSummary, nextDetail, nextMediaPage, nextPlaybackSettings]) => {
          setSummary(nextSummary);
          setDetail(nextDetail);
          setMediaPage(nextMediaPage);
          setPlaybackSettings(nextPlaybackSettings);
          setError("");
        })
        .catch((loadError) => {
          setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard.");
        });
    });
  }, [selectedStationId]);

  const createDemoData = async () => {
    if (!selectedStationId || !detail) {
      return;
    }

    setError("");
    try {
      await createMediaAsset({
        stationId: selectedStationId,
        title: "ข่าวเช้า Urban Update",
        artist: "The Urban Radio",
        language: "th",
        durationSeconds: 180,
        tags: ["thai", "news"]
      });
      await createPlaylist({
        stationId: selectedStationId,
        name: "Bangkok Sunrise",
        locale: "th"
      });
      await createScheduleEvent({
        stationId: selectedStationId,
        action: "playout",
        title: "Morning Opener",
        startsAt: new Date(Date.now() + 60_000).toISOString()
      });
      await createRelay({
        stationId: selectedStationId,
        name: "Bangkok Relay",
        sourceUrl: "https://relay.example.com/urban.mp3"
      });
      await createRecordingJob({
        stationId: selectedStationId,
        name: "Morning Archive"
      });

      const [nextSummary, nextDetail, nextMediaPage, nextPlaybackSettings] = await Promise.all([
        getDashboardSummary(selectedStationId),
        getStationDetail(selectedStationId),
        getMediaAssets(selectedStationId),
        getPlaybackSettings(selectedStationId)
      ]);
      setSummary(nextSummary);
      setDetail(nextDetail);
      setMediaPage(nextMediaPage);
      setPlaybackSettings(nextPlaybackSettings);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create demo data.");
    }
  };

  const loadMoreMedia = async () => {
    if (!selectedStationId || !mediaPage?.nextCursor) {
      return;
    }

    setLoadingMoreMedia(true);
    setError("");

    try {
      const nextPage = await getMediaAssets(selectedStationId, mediaPage.nextCursor);
      setMediaPage({
        ...nextPage,
        items: [...mediaPage.items, ...nextPage.items]
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load more songs.");
    } finally {
      setLoadingMoreMedia(false);
    }
  };

  const patchPlaybackSettings = <K extends keyof PlaybackSettings>(key: K, value: PlaybackSettings[K]) => {
    setPlaybackSettings((current) => (current ? { ...current, [key]: value } : current));
  };

  const savePlaybackProfile = async () => {
    if (!playbackSettings) {
      return;
    }

    setSavingPlaybackSettings(true);
    setError("");

    try {
      const saved = await updatePlaybackSettings({
        stationId: playbackSettings.stationId,
        transitionsEnabled: playbackSettings.transitionsEnabled,
        transitionStyle: playbackSettings.transitionStyle,
        soundEnhancerEnabled: playbackSettings.soundEnhancerEnabled,
        soundEnhancerLevel: playbackSettings.soundEnhancerLevel,
        soundCheckEnabled: playbackSettings.soundCheckEnabled,
        losslessAudioEnabled: playbackSettings.losslessAudioEnabled,
        streamingLosslessQuality: playbackSettings.streamingLosslessQuality,
        downloadLosslessQuality: playbackSettings.downloadLosslessQuality,
        spatialAudioMode: playbackSettings.spatialAudioMode,
        hdmiPassthroughMode: playbackSettings.hdmiPassthroughMode,
        videoStreamingQuality: playbackSettings.videoStreamingQuality,
        videoDownloadQuality: playbackSettings.videoDownloadQuality
      });
      setPlaybackSettings(saved);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save playback settings.");
    } finally {
      setSavingPlaybackSettings(false);
    }
  };

  return (
    <AppShell
      eyebrow="The Urban Radio Cloud"
      title="Automation control plane"
      description="A realtime view of one-station operations: media assets, playlists, schedules, relays, recordings, and worker status."
    >
      <section style={{ display: "grid", gap: 20 }}>
        <section style={panelStyle}>
          <label style={fieldStyle}>
            Active Station
            <select
              aria-label="Active Station"
              style={inputStyle}
              value={selectedStationId}
              onChange={(event) => setSelectedStationId(event.target.value)}
            >
              {stations.length === 0 ? <option value="">No provisioned stations yet</option> : null}
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </label>
          <button type="button" style={buttonStyle} onClick={createDemoData} disabled={!selectedStationId || isPending}>
            Seed Cloud Demo Data
          </button>
          {error ? <p style={errorStyle}>{error}</p> : null}
        </section>

        <MetricGrid
          metrics={[
            { label: "Media Assets", value: String(summary?.library.totalAssets ?? 0) },
            { label: "Playlists", value: String(summary?.counts.playlists ?? 0) },
            { label: "Schedules", value: String(summary?.counts.scheduleEvents ?? 0) },
            { label: "Relays", value: String(summary?.counts.relays ?? 0) },
            { label: "Recording Jobs", value: String(summary?.counts.recordingJobs ?? 0) },
            { label: "Commands", value: String(summary?.counts.commands ?? 0) }
          ]}
        />

        <section style={playbackPanelStyle}>
          <div style={playbackHeaderStyle}>
            <h2 style={{ margin: 0, fontSize: "2rem" }}>Playback</h2>
            <p style={settingsDescriptionStyle}>
              Hosted playback preferences for transitions, loudness shaping, lossless delivery, spatial audio, and video.
            </p>
          </div>

          <div style={playbackTabsStyle}>
            {[
              ["general", "General"],
              ["playback", "Playback"],
              ["files", "Files"],
              ["advanced", "Advanced"]
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSettingsTab(id as typeof settingsTab)}
                style={{
                  ...playbackTabButtonStyle,
                  ...(settingsTab === id ? playbackTabButtonActiveStyle : null)
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {settingsTab === "playback" ? (
            playbackSettings ? (
              <section style={{ display: "grid", gap: 24 }}>
                <SettingsSection
                  title="Song Transitions"
                  description="Blend beginnings and endings of songs together for smoother automated playback."
                >
                  <ToggleRow
                    label="Enable Song Transitions"
                    checked={playbackSettings.transitionsEnabled}
                    onChange={(value) => patchPlaybackSettings("transitionsEnabled", value)}
                  />
                  <SelectRow
                    label="Transition Style"
                    value={playbackSettings.transitionStyle}
                    onChange={(value) => patchPlaybackSettings("transitionStyle", value as PlaybackSettings["transitionStyle"])}
                    options={[
                      ["automix", "AutoMix"],
                      ["crossfade", "Crossfade"],
                      ["cut", "Cut"]
                    ]}
                  />
                </SettingsSection>

                <SettingsSection
                  title="Sound Enhancer"
                  description="Adjust output energy and keep song playback volume at a stable on-air level."
                >
                  <ToggleRow
                    label="Enable Sound Enhancer"
                    checked={playbackSettings.soundEnhancerEnabled}
                    onChange={(value) => patchPlaybackSettings("soundEnhancerEnabled", value)}
                  />
                  <RangeRow
                    label="Enhancer Level"
                    value={playbackSettings.soundEnhancerLevel}
                    onChange={(value) => patchPlaybackSettings("soundEnhancerLevel", value)}
                  />
                  <ToggleRow
                    label="Enable Sound Check"
                    checked={playbackSettings.soundCheckEnabled}
                    onChange={(value) => patchPlaybackSettings("soundCheckEnabled", value)}
                  />
                </SettingsSection>

                <SettingsSection
                  title="Lossless Audio"
                  description="Preserve more detail for premium audio paths and archive workflows."
                >
                  <ToggleRow
                    label="Enable Lossless Audio"
                    checked={playbackSettings.losslessAudioEnabled}
                    onChange={(value) => patchPlaybackSettings("losslessAudioEnabled", value)}
                  />
                  <SelectRow
                    label="Streaming"
                    value={playbackSettings.streamingLosslessQuality}
                    onChange={(value) =>
                      patchPlaybackSettings("streamingLosslessQuality", value as PlaybackSettings["streamingLosslessQuality"])
                    }
                    options={[
                      ["lossless", "Lossless"],
                      ["hi_res_lossless", "Hi-Res Lossless"]
                    ]}
                  />
                  <SelectRow
                    label="Download"
                    value={playbackSettings.downloadLosslessQuality}
                    onChange={(value) =>
                      patchPlaybackSettings("downloadLosslessQuality", value as PlaybackSettings["downloadLosslessQuality"])
                    }
                    options={[
                      ["lossless", "Lossless"],
                      ["hi_res_lossless", "Hi-Res Lossless"]
                    ]}
                  />
                </SettingsSection>

                <SettingsSection
                  title="Spatial Audio and Video"
                  description="Control Dolby Atmos style playback preferences, HDMI passthrough, and video quality defaults."
                >
                  <SelectRow
                    label="Spatial Audio"
                    value={playbackSettings.spatialAudioMode}
                    onChange={(value) => patchPlaybackSettings("spatialAudioMode", value as PlaybackSettings["spatialAudioMode"])}
                    options={[
                      ["automatic", "Automatic"],
                      ["always_on", "Always On"],
                      ["off", "Off"]
                    ]}
                  />
                  <SelectRow
                    label="HDMI Passthrough"
                    value={playbackSettings.hdmiPassthroughMode}
                    onChange={(value) =>
                      patchPlaybackSettings("hdmiPassthroughMode", value as PlaybackSettings["hdmiPassthroughMode"])
                    }
                    options={[
                      ["prefer", "Prefer HDMI Passthrough"],
                      ["never", "Never"]
                    ]}
                  />
                  <SelectRow
                    label="Video Streaming"
                    value={playbackSettings.videoStreamingQuality}
                    onChange={(value) =>
                      patchPlaybackSettings("videoStreamingQuality", value as PlaybackSettings["videoStreamingQuality"])
                    }
                    options={[
                      ["best_4k", "Best (Up to 4K)"],
                      ["up_to_hd", "Up to HD"]
                    ]}
                  />
                  <SelectRow
                    label="Video Download"
                    value={playbackSettings.videoDownloadQuality}
                    onChange={(value) =>
                      patchPlaybackSettings("videoDownloadQuality", value as PlaybackSettings["videoDownloadQuality"])
                    }
                    options={[
                      ["best_4k", "Best (Up to 4K)"],
                      ["up_to_hd", "Up to HD"]
                    ]}
                  />
                </SettingsSection>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="button" style={buttonStyle} onClick={savePlaybackProfile} disabled={savingPlaybackSettings}>
                    {savingPlaybackSettings ? "Saving..." : "Save Playback Profile"}
                  </button>
                </div>
              </section>
            ) : (
              <p style={emptyStyle}>Loading playback settings…</p>
            )
          ) : (
            <p style={emptyStyle}>This tab is reserved for future settings groups.</p>
          )}
        </section>

        <section style={gridStyle}>
          <DataPanel title="Station Overview">
            {detail ? (
              <dl style={detailsStyle}>
                <div><dt>Name</dt><dd>{detail.station.name}</dd></div>
                <div><dt>Plan</dt><dd>{detail.station.plan}</dd></div>
                <div><dt>Status</dt><dd>{detail.station.status}</dd></div>
                <div><dt>Timezone</dt><dd>{detail.station.timezone}</dd></div>
                <div><dt>Library Size</dt><dd>{detail.library?.totalAssets ?? 0}</dd></div>
                <div><dt>Capacity</dt><dd>{detail.library?.maxAssets ?? 1000000}</dd></div>
              </dl>
            ) : (
              <p style={emptyStyle}>Choose a station to load the dashboard.</p>
            )}
          </DataPanel>

          <DataPanel title="Worker Health">
            {summary?.latestWorkerStatus ? (
              <dl style={detailsStyle}>
                <div><dt>Worker</dt><dd>{summary.latestWorkerStatus.workerName}</dd></div>
                <div><dt>Health</dt><dd>{summary.latestWorkerStatus.health}</dd></div>
                <div><dt>Last Seen</dt><dd>{summary.latestWorkerStatus.lastSeenAt}</dd></div>
              </dl>
            ) : (
              <p style={emptyStyle}>No worker status yet.</p>
            )}
          </DataPanel>

          <DataPanel title="Queue / Commands">
            <ItemList
              items={detail?.commands ?? []}
              render={(command) => `${command.type} · ${command.status}`}
              emptyLabel="No commands queued yet."
            />
          </DataPanel>

          <DataPanel title="Recent Media Library">
            <ItemList
              items={mediaPage?.items ?? []}
              render={(asset: MediaAsset) => `${asset.title} · ${asset.artist} · ${asset.language}`}
              emptyLabel="No media assets yet."
            />
            {mediaPage?.nextCursor ? (
              <button type="button" style={secondaryButtonStyle} onClick={loadMoreMedia} disabled={loadingMoreMedia}>
                {loadingMoreMedia ? "Loading..." : "Load More Songs"}
              </button>
            ) : null}
          </DataPanel>

          <DataPanel title="Playlists">
            <ItemList
              items={detail?.playlists ?? []}
              render={(playlist) => `${playlist.name} · ${playlist.locale}`}
              emptyLabel="No playlists yet."
            />
          </DataPanel>

          <DataPanel title="Schedules">
            <ItemList
              items={detail?.scheduleEvents ?? []}
              render={(event) => `${event.title} · ${event.action}`}
              emptyLabel="No schedule events yet."
            />
          </DataPanel>

          <DataPanel title="Relays + Recording">
            <ItemList
              items={[
                ...(detail?.relays ?? []).map((relay) => `${relay.name} · ${relay.status}`),
                ...(detail?.recordingJobs ?? []).map((job) => `${job.name} · ${job.status}`)
              ]}
              render={(item) => item}
              emptyLabel="No relays or recording jobs yet."
            />
          </DataPanel>
        </section>
      </section>
    </AppShell>
  );
};

const DataPanel = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section style={panelStyle}>
    <h2 style={{ marginTop: 0 }}>{title}</h2>
    {children}
  </section>
);

const ItemList = <T,>({
  items,
  render,
  emptyLabel
}: {
  items: T[];
  render: (item: T) => string;
  emptyLabel: string;
}) => {
  if (items.length === 0) {
    return <p style={emptyStyle}>{emptyLabel}</p>;
  }

  return (
    <ul style={listStyle}>
      {items.map((item, index) => (
        <li key={index}>{render(item)}</li>
      ))}
    </ul>
  );
};

const SettingsSection = ({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section style={settingsSectionStyle}>
    <h3 style={{ margin: 0, fontSize: "1.8rem" }}>{title}</h3>
    <p style={settingsDescriptionStyle}>{description}</p>
    {children}
  </section>
);

const ToggleRow = ({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <label style={settingsLabelRowStyle}>
    <span>{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      style={checkboxStyle}
    />
  </label>
);

const SelectRow = ({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) => (
  <label style={settingsRowStyle}>
    <span>{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} style={darkSelectStyle}>
      {options.map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>
          {optionLabel}
        </option>
      ))}
    </select>
  </label>
);

const RangeRow = ({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) => (
  <label style={settingsRowStyle}>
    <div style={settingsLabelRowStyle}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      style={rangeStyle}
    />
  </label>
);

const panelStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 24,
  padding: 24,
  display: "grid",
  gap: 16
} as const;

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 20
} as const;

const inputStyle = {
  width: "100%",
  marginTop: 8,
  padding: 12,
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "#fff"
} as const;

const fieldStyle = {
  display: "grid"
} as const;

const buttonStyle = {
  border: 0,
  borderRadius: 999,
  padding: "14px 18px",
  background: "var(--accent)",
  color: "white",
  fontWeight: 700,
  cursor: "pointer"
} as const;

const secondaryButtonStyle = {
  border: "1px solid var(--border)",
  borderRadius: 999,
  padding: "12px 16px",
  background: "#fff",
  color: "var(--foreground)",
  fontWeight: 700,
  cursor: "pointer"
} as const;

const detailsStyle = {
  margin: 0,
  display: "grid",
  gap: 8
} as const;

const listStyle = {
  margin: 0,
  paddingLeft: 18,
  display: "grid",
  gap: 8
} as const;

const emptyStyle = {
  margin: 0,
  color: "var(--muted)"
} as const;

const errorStyle = {
  margin: 0,
  color: "#b42318"
} as const;

const playbackPanelStyle = {
  background: "#2d241f",
  color: "#f7f1eb",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 28,
  padding: 28,
  display: "grid",
  gap: 24,
  boxShadow: "0 20px 60px rgba(0,0,0,0.35)"
} as const;

const playbackHeaderStyle = {
  display: "grid",
  gap: 8,
  justifyItems: "center",
  textAlign: "center"
} as const;

const playbackTabsStyle = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  justifyContent: "center"
} as const;

const playbackTabButtonStyle = {
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 18,
  padding: "12px 18px",
  background: "rgba(255,255,255,0.03)",
  color: "#d8cbc1",
  fontWeight: 700,
  cursor: "pointer"
} as const;

const playbackTabButtonActiveStyle = {
  background: "rgba(255,89,110,0.16)",
  color: "#ff596e",
  boxShadow: "inset 0 0 0 1px rgba(255,89,110,0.22)"
} as const;

const settingsSectionStyle = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  paddingTop: 20,
  display: "grid",
  gap: 14
} as const;

const settingsDescriptionStyle = {
  margin: 0,
  color: "rgba(247,241,235,0.75)"
} as const;

const settingsRowStyle = {
  display: "grid",
  gap: 8
} as const;

const settingsLabelRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12
} as const;

const darkSelectStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.07)",
  color: "#f7f1eb"
} as const;

const checkboxStyle = {
  width: 18,
  height: 18,
  accentColor: "#ff596e"
} as const;

const rangeStyle = {
  width: "100%",
  accentColor: "#ff596e"
} as const;
