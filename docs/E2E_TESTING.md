# End-to-End Testing (Playwright) — Detailed Guide

This document describes the full E2E test suite, how to run it, and what each test verifies.

---

## Prerequisites

- **Node 18+**
- **Dependencies:** `npm install`
- **Browsers (one-time):** `npx playwright install chromium` (requires network)

---

## Quick start

```bash
# Run all E2E tests (starts Public app automatically)
npm run test:e2e

# Interactive UI mode for debugging
npm run test:e2e:ui
```

By default, only **Public app** tests run; the config starts the Public app with `npm run dev:public` and waits for `BASE_URL` (default `http://localhost:3000`) to be ready.

---

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `http://localhost:3000` | Public app URL (used by `public.spec.ts` and as `webServer` target). |
| `BASE_URL_CONSOLE` | `http://localhost:3001` | Console app URL. If **not set**, all console tests are **skipped**. |
| `BASE_URL_ADMIN` | `http://localhost:3002` | Admin app URL. If **not set**, all admin tests are **skipped**. |
| `BASE_URL_API` | `http://localhost:8787` | Control API URL. If **not set**, all API tests are **skipped**. |
| `BASE_URL_PLAYOUT` | `http://localhost:8080` | Playout container URL. If **not set**, all playout tests are **skipped**. |
| `CI` | — | When set (e.g. `CI=1`), `webServer` is not started; use when the app is already running. |

---

## Running full suite (all apps)

Start each app in a separate terminal, then run tests with all base URLs set:

```bash
# Terminal 1 — Public (or use default webServer)
npm run dev:public

# Terminal 2 — Console (port 3001 if your vinext dev uses it)
npm run dev:console

# Terminal 3 — Admin (port 3002)
npm run dev:admin

# Terminal 4 — Control API
npm run dev:api

# Terminal 5 — Playout container
npm run dev:playout

# Terminal 6 — Run E2E with all URLs (no webServer for public if already running)
CI=1 BASE_URL=http://localhost:3000 BASE_URL_CONSOLE=http://localhost:3001 BASE_URL_ADMIN=http://localhost:3002 BASE_URL_API=http://localhost:8787 BASE_URL_PLAYOUT=http://localhost:8080 npm run test:e2e
```

If you only start the Public app, omit the other `BASE_URL_*` vars; console, admin, API, and playout tests will be skipped.

---

## Test files and coverage

### 1. `e2e/public.spec.ts` — Public app (Listener Delivery)

**Runs when:** Public app is available at `BASE_URL` (started by config or already running).

| Suite | Test | What it verifies |
|-------|------|------------------|
| **Page load and shell** | Loads without error and shows app name | Heading "RadioBOSS Public" visible. |
| | Shows main title and subtitle | "Listener Delivery" and edge/HLS subtitle. |
| | Has language switcher links | Links "English" and "Thai" in header. |
| | Has nav links for Broadcasting, Widgets, Metadata | Nav links present. |
| **Stat cards** | Widget ID stat card | "Widget ID" and value/hint. |
| | Playback host stat card | "Playback host" visible. |
| | Environment stat card | "Environment" visible. |
| **Sections (English)** | Broadcasting section | Heading "Broadcasting"; encoder, listeners, now playing export, statistics. |
| | Now playing section | "Now playing"; current track, next track. |
| | Error section | Error heading; connection failed, stream error, invalid token, token expired, please restart. |
| | Language section | Language heading; Thai, English, Help. |
| **Thai locale (lang=th)** | URL lang=th shows Thai in switcher | Links "ภาษาไทย" and "English". |
| | Nav label Broadcasting is Thai | "การออกอากาศ" in nav. |
| | Broadcasting section heading Thai | Section heading in Thai. |
| | Streaming list items Thai | Listeners, encoder, now playing export, statistics in Thai. |
| | Error messages Thai | Connection failed, stream error, invalid token, token expired, please restart in Thai. |
| | Error section heading Thai | "ข้อผิดพลาด". |
| | Now playing labels Thai | Current/next track in Thai. |
| **Language switcher** | Clicking English | URL has `?lang=en`, English content visible. |
| | Clicking Thai | URL has `?lang=th`, Thai content visible. |
| | Language preserved with hash | `?lang=th` preserved when clicking nav. |
| **URL and default locale** | No lang param defaults to English | English content. |
| | Invalid lang param falls back to English | e.g. `?lang=xx` shows English. |
| **Token validation** | No token param: no token error section | At most 2 Error headings. |
| | Invalid token param | Body contains invalid_token or please_restart or token_expired. |
| **Accessibility and structure** | Main content has headings | Broadcasting heading visible. |
| | Links have discernible text and href | At least 3 links with href. |
| | Main landmark | At least one `role="main"`. |

---

### 2. `e2e/console.spec.ts` — Console app (Operations Console)

**Runs when:** `BASE_URL_CONSOLE` is set (e.g. Console app running on port 3001). **Skipped** if not set.

| Suite | Test | What it verifies |
|-------|------|------------------|
| **Page load and shell** | Loads and shows Operations Console | Heading with "Operations Console". |
| | Subtitle (Workers, Durable Objects, D1) | Subtitle text. |
| | Language switcher | English and Thai links. |
| | Nav links | Player, Music Library, Scheduler, Broadcasting, Report Generator. |
| **Stat cards** | Environment, Playback host, Control API | All three cards visible. |
| **Sections (English)** | Player section | Live Assist, current track, next track, crossfade, voice tracking. |
| | Music Library section | Search, Tags, Artwork, Comments. |
| | Scheduler section | Events, Recurring, Commands, Manual mode. |
| | Broadcasting section | Encoder, listeners, now playing export, statistics. |
| | Report Generator section | Date range, Export XLS/PDF, airplay. |
| | Error section | File not found, connection failed, please restart. |
| **Thai locale** | Nav labels Thai | Broadcasting, Library, Scheduler, Report Generator in Thai. |
| | Player section Thai | Live assist, current/next track in Thai. |
| | Error messages Thai | Connection failed, please restart in Thai. |
| **Language switcher** | Switch to Thai | URL `?lang=th`, Thai content. |
| | Switch to English | URL `?lang=en`, English content. |

---

### 3. `e2e/admin.spec.ts` — Admin app (Hosting Admin)

**Runs when:** `BASE_URL_ADMIN` is set. **Skipped** if not set.

| Suite | Test | What it verifies |
|-------|------|------------------|
| **Page load and shell** | Loads and shows RadioBOSS.FM / Hosting Admin | Headings. |
| | Subtitle (tenancy, provisioning, billing) | Subtitle text. |
| | Language switcher | English and Thai. |
| | Nav links | Plans, Provisioning, Ads, Reports, Observability. |
| **Stat cards** | Environment, Access audience, Billing provider | All three. |
| **Sections (English)** | Advertisement Scheduler | Commercial break, groups, start/end date. |
| | Report Generator | Generate report, export PDF, compliance. |
| | Provisioning workflow | Tenant/station, D1 schema, R2, widget defaults. |
| | Pilot gates | 14-day playout soak. |
| | Settings | Language, Save, etc. |
| | Error section | Connection failed, save failed. |
| **Thai locale** | Nav Ads/Reports Thai | Thai labels. |
| | Ads section heading Thai | "ตัวจัดตารางโฆษณา". |
| | Settings and Error headings Thai | Thai headings. |
| | Error messages Thai | Connection failed, save failed in Thai. |
| **Language switcher** | Switch to Thai / English | URL and content update. |

---

### 4. `e2e/api.spec.ts` — Control API

**Runs when:** `BASE_URL_API` is set (e.g. `http://localhost:8787`). **Skipped** if not set.

| Suite | Test | What it verifies |
|-------|------|------------------|
| **Health** | GET /health 200, ok true | JSON with `ok: true`, `data.service: "control-api"`. |
| | Health includes env and stationDbMode | `data.env`, `data.stationDbMode`. |
| **validate-widget** | No token → 400 | Error in body. |
| | Invalid token → 401, error invalid_token or token_expired | 401 and `error` field. |
| | Empty token → 400 | 400. |
| **Tenants and stations** | GET /v1/tenants 200, data array | `ok: true`, `data` is array. |
| | GET /v1/stations 200, data array | Same. |

---

### 5. `e2e/playout.spec.ts` — Playout container

**Runs when:** `BASE_URL_PLAYOUT` is set (e.g. `http://localhost:8080`). **Skipped** if not set.

| Suite | Test | What it verifies |
|-------|------|------------------|
| **Health** | GET /health 200, ok true | `data.service: "playout-container"`. |
| | Health includes stations count | `data.stations` number. |
| **Station state** | GET /stations/demo-station 200 | `stationId`, `mode`, `queue` array. |
| **Live stream** | GET /stations/demo-station/live 200, audio/wav | Content-Type audio/wav, body > 44 bytes. |
| **404** | GET /unknown 404 | 404. |

---

## Fixtures and constants

- **`e2e/fixtures/constants.ts`** — Exports `EN` and `TH` objects with locale strings used in assertions (aligned with `locales/en/*.json` and `locales/th/*.json`). Update this file when you add or change UI copy so tests stay in sync.

---

## CI

1. Start the Public app (and optionally Console, Admin, API, Playout) in a previous step.
2. Set `CI=1` and the appropriate `BASE_URL*` variables.
3. Run `npm run test:e2e`.

Example (GitHub Actions style):

```yaml
- run: npm run dev:public &
- run: npx wait-on http://localhost:3000
- run: CI=1 BASE_URL=http://localhost:3000 npm run test:e2e
```

---

## Adding or changing tests

1. **New app:** Add `e2e/<app>.spec.ts` and use `process.env.BASE_URL_<APP>` with `test.skip(() => !process.env.BASE_URL_<APP>)` if the app is optional.
2. **New assertions:** Reuse or extend `e2e/fixtures/constants.ts` so EN/TH strings match the locale files.
3. **New project (e.g. different browser):** Add a project in `playwright.config.ts` with another `devices` entry.
