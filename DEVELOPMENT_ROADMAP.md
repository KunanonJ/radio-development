# DJSoft.Net — Development Roadmap

This roadmap is derived from the [Complete Product Requirements Document (PRD)](./DJSoft.Net%20—%20Complete%20Product%20Requirements%20Document%20(Detailed%20Features).md) and organizes development into phases with clear priorities and deliverables.

---

## Scope Summary

| Product | Type | PRD Sections | Priority for Dev |
|--------|------|--------------|------------------|
| **RadioBOSS** | Desktop (Windows) | 1–13 | Core — automation, player, scheduler, streaming |
| **RadioLogger** | Desktop (Windows) | 14 | Recording & logging |
| **RadioCaster** | Desktop (Windows) | 15 | Live encoder & streaming |
| **RadioBOSS.FM** | Cloud / Hosting | 16 | Stream hosting service |
| **RadioBOSS Cloud** | Web | 17 | Web-based automation |
| **Thai (ภาษาไทย)** | Localization | 18–23 | New feature — all products |

---

## Phase 1: Foundation & Thai Localization (Current Priority)

**Goal:** Enable Thai language across all products and establish i18n/l10n infrastructure.

### 1.1 Infrastructure

- [ ] **I18n framework** — Confirm/add localization framework for each product (resource files, key naming, fallback).
- [ ] **UTF-8 everywhere** — Audit and enforce UTF-8 for storage, API, file I/O, and exports.
- [ ] **Thai font stack** — Define and document fallback chain (desktop: Tahoma, Leelawadee UI, Sarabun New; web: Sarabun/Noto Sans Thai).
- [ ] **Language selector** — Implement or expose “ภาษาไทย” in settings with restart or immediate switch as per PRD (TH-012).

### 1.2 High-priority Thai requirements (PRD §20)

| Req ID | Requirement | Deliverable |
|--------|-------------|-------------|
| TH-001 | RadioBOSS UI Translation | All menus, dialogs, tooltips, status/error messages in Thai |
| TH-002 | RadioLogger UI Translation | Full UI including recording, scheduler, settings |
| TH-003 | RadioCaster UI Translation | Encoder, streaming, statistics in Thai |
| TH-005 | Thai character display | Correct rendering U+0E00–U+0E7F in playlists, tags, comments, metadata, Notepad |
| TH-010 | Thai metadata export | UTF-8 in Now Playing (HTTP, FTP, text/XML) |
| TH-012 | Thai language selector | “ภาษาไทย” in preferences, locale switch |
| TH-014 | Thai search & indexing | Library search and indexing with Thai tokenization |
| TH-016 | Thai installer (optional) | Thai option in installers for RadioBOSS, RadioLogger, RadioCaster |

### 1.3 Acceptance criteria (from PRD §22)

- All UI in RadioBOSS, RadioLogger, RadioCaster displays correctly in Thai (no truncation/overlap).
- User can select “ภาษาไทย” and change applies (immediate or after restart).
- Thai in metadata, playlists, comments, reports renders correctly in all views and exports.
- Music Library search returns correct results for Thai queries.
- Remote Control API returns UTF-8-encoded Thai in responses.

---

## Phase 2: RadioBOSS Core Enhancements

**Goal:** Align desktop RadioBOSS with PRD feature set and quality bar.

### 2.1 Player (PRD §1)

- Crossfading, volume leveling (EBUR128), silence trimming.
- Multichannel (4.0, 5.1, 7.1), ASIO/WASAPI, VST/WinAMP DSP.
- Cart Wall, Live Assist, DTMF, Voice Tracking, TTS, time announcements.
- Segue editor, track tool, intro countdown.

### 2.2 Playlist Generator (PRD §2)

- Auto generation, templates, rotations, proportional selection.
- Repeat protection (track/artist/title/tags), dayparting, priority rules.
- Hour markers, commercials, sweepers, duplicate/nonexistent file detection.
- Command-line and scheduler-triggered generation.

### 2.3 Music Library (PRD §3)

- Batch processing, tags, multi-tag, indexing, filters, usage stats.
- Artwork, BPM, CSV export, prelisten, dangling file cleanup.

### 2.4 Scheduler (PRD §4)

- Events by time, post-song, recurrence, multiple start times, expiration.
- DTMF-triggered events, queue options, override artwork, ad volume.

### 2.5 Streaming & Reports (PRD §6–7)

- Multi-codec streaming, Icecast/Shoutcast/RTMP, built-in server.
- Now Playing metadata export, statistics, relay.
- Report Generator: date range, filters, XLS/PDF, accessibility.

---

## Phase 3: RadioLogger & RadioCaster

**Goal:** Full feature parity with PRD for recording and live streaming.

### 3.1 RadioLogger (PRD §14)

- Scheduled recording, on-the-fly encoding, direct playback recording.
- Split by time, low CPU, history, auto-delete old records, ASIO, silence detection, email alerts.
- Tray minimize, Windows auto-start.

### 3.2 RadioCaster (PRD §15)

- Audio capture, stream transcoding, multi-format encoding.
- Icecast 2, Shoutcast v1/v2, Windows Media, built-in server.
- DSP, VST/WinAMP plugins, statistics, setup wizard.

---

## Phase 4: Cloud & Hosting

**Goal:** Web and hosting services per PRD.

### 4.1 RadioBOSS Cloud (PRD §17)

- Web control panel (responsive), Live + AutoDJ, unlimited playlists.
- Drag-and-drop media, FTP, rotations, scheduler (recurring, queue options).
- Crossfading, listener reports, queue monitoring, multi-format, relay.
- Widgets, TuneIn/Twitter/HTTP hooks, TTS, reliability/monitoring.

### 4.2 RadioBOSS.FM (PRD §16)

- Control panel, statistics, live streaming, 24/7 automation.
- Port 80/HTTPS, scalability, instant setup, support.

---

## Phase 5: Thai — Medium/Low & Polish

**Goal:** Complete Thai scope and quality.

### 5.1 Medium priority (PRD §20)

- TH-004: RadioBOSS Cloud panel in Thai.
- TH-006: Report Generator Thai (XLS, PDF, fonts).
- TH-007: TTS Thai voice option.
- TH-011: Thai locale formatting (date/time, Buddhist Era option).
- TH-013: Cart Wall Thai labels.
- TH-015: API responses Thai/UTF-8 verification.

### 5.2 Low priority

- TH-008: Thai user documentation (PDF/online).
- TH-009: Thai time announcement voice pack.

### 5.3 QA & acceptance

- Full pass against PRD §22 acceptance criteria.
- Native Thai speaker review and testing.

---

## System Requirements (Reference)

From PRD §§12, 14, 15:

- **OS:** Windows 7 SP1+, 8.1, 10, 11, Server 2012 R2 / 2016 / 2019 (32/64-bit).
- **CPU:** 2 GHz, 2 cores min.
- **RAM:** 1 GB min.
- **Disk:** 1 GB free.

---

## Next Steps

1. **Immediate:** Start Phase 1 — i18n audit and Thai string extraction for RadioBOSS (TH-001, TH-005, TH-012).
2. **Parallel:** Document current codebase structure (modules, build, tests) and add to `docs/ARCHITECTURE.md`.
3. **Sprint planning:** Break Phase 1 into 2-week sprints using `docs/THAI_LOCALIZATION_SPEC.md` task list.
