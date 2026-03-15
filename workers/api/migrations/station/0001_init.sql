CREATE TABLE IF NOT EXISTS station_registry (
  station_id TEXT PRIMARY KEY,
  station_db_key TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS playlists (
  id TEXT PRIMARY KEY,
  station_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS schedule_events (
  id TEXT PRIMARY KEY,
  station_id TEXT NOT NULL,
  name TEXT NOT NULL,
  start_at TEXT NOT NULL,
  recurrence_json TEXT NOT NULL,
  target_playlist_id TEXT,
  action TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS widgets (
  id TEXT PRIMARY KEY,
  station_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  theme TEXT NOT NULL,
  locale TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS webhooks (
  id TEXT PRIMARY KEY,
  station_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  secret TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ingest_jobs (
  id TEXT PRIMARY KEY,
  station_id TEXT NOT NULL,
  object_key TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
