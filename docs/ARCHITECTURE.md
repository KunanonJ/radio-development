# The Urban Radio Architecture

## Core Principles

- Firebase owns application identity, state, permissions, realtime updates, and control-plane workflows.
- Cloud Run workers own long-running audio, recording, export, and indexing jobs.
- The product is web-only. Low-latency desktop studio features are intentionally excluded.
- UTF-8 and Thai-capable rendering/search are platform requirements, not add-ons.

## Product Surfaces

- **The Urban Radio Cloud**: playlists, scheduler, relays, reports, widgets, TTS, queue monitoring
- **The Urban Radio FM**: station provisioning, listener capacity, plan administration, stream endpoints
- **Live Ingest Service**: managed live source registration and transcoding orchestration
- **Recording Service**: stream archival, splitting, retention, silence alerts

## System Boundaries

### Web App

- Next.js 15 app serving:
  - `/cloud`
  - `/fm`
  - `/docs`
  - `/api/widgets/*`

### Firebase Control Plane

- Firebase Auth for users and API users
- Firestore for tenants, stations, playlists, rotations, schedules, relays, reports, widgets, audits
- Cloud Functions for provisioning, command routing, metadata exports, and report dispatch
- Cloud Storage for media and generated artifacts

### Worker Plane

- `workers/automation`: playout orchestration, relay failover, recording, export dispatch
- `workers/indexer`: Firestore to Algolia indexing with Thai token preparation

## Data Flow

1. Web app writes station configuration into Firestore through authenticated APIs.
2. Functions validate and publish async commands to Pub/Sub.
3. Cloud Run workers execute commands and write state snapshots back to Firestore.
4. Web UI subscribes to Firestore updates for realtime dashboards.
5. Search indexing worker mirrors relevant documents into Algolia.
