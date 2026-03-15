# DJSoft.Net — Architecture Overview

This document provides a high-level architecture view derived from the PRD. It is intended for development planning and onboarding. Actual implementation may vary by product and codebase.

---

## Product Matrix

| Product | Platform | Primary role |
|---------|----------|--------------|
| **RadioBOSS** | Windows desktop | Automation, playout, scheduling, streaming, library |
| **RadioLogger** | Windows desktop | Record and archive broadcasts |
| **RadioCaster** | Windows desktop | Live encode and stream from any input |
| **RadioBOSS.FM** | Web / backend | Stream hosting, control panel |
| **RadioBOSS Cloud** | Web | Full web-based automation and streaming |

---

## RadioBOSS — Logical Modules (from PRD)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RadioBOSS (Desktop)                              │
├─────────────────────────────────────────────────────────────────────────┤
│  Player (Core)     │ Playlist Generator │ Music Library │ Scheduler     │
│  - Playback        │ - Auto generation  │ - Assets     │ - Events      │
│  - Crossfade      │ - Templates        │ - Tags/Index  │ - Commands    │
│  - Inputs/Live     │ - Rotations        │ - Batch       │ - Recurrence │
│  - Voice/TTS       │ - Constraints      │ - Reports     │ - DTMF       │
│  - DSP/VST/ASIO   │ - Dayparting       │               │               │
├─────────────────────────────────────────────────────────────────────────┤
│  Advertisement Scheduler │ Streaming (Built-in) │ Report Generator      │
│  - Commercial breaks     │ - Multi-codec       │ - Airplay/compliance │
│  - Remote ads            │ - Icecast/Shoutcast │ - XLS/PDF             │
│  - Intros/outros         │ - RTMP, relay       │ - Filters            │
├─────────────────────────────────────────────────────────────────────────┤
│  UI & Customization │ Administration & Security │ Accessibility        │
│  - Layout/themes   │ - Profiles, RBAC          │ - Screen reader      │
│  - Work zones      │ - Remote Control API      │ - Keyboard/hotkeys  │
│  - Now Playing     │ - Song Request API         │ - End track beep     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Key Technical Boundaries

### Audio pipeline (Player)

- **Inputs:** Files (multi-format), streams (HTTP/MMS/FTP), mic, line-in, cart wall.
- **Processing:** Crossfade, EBUR128 leveling, silence trim, EQ, compressor, VST/WinAMP DSP, ASIO/WASAPI.
- **Output:** Sound card (multichannel), streaming encoders (multi-codec), relay.

### Data flow

- **Library → Playlist Generator:** Categories, tags, rules, repeat protection, dayparting.
- **Playlist Generator → Scheduler:** Generated playlists, hour markers, ad breaks.
- **Player ↔ Streaming:** Encoded output to Icecast/Shoutcast/RTMP/built-in server.
- **Now Playing:** Metadata export via HTTP, FTP, file (text/XML); UTF-8 for Thai (TH-010).

### Remote Control API

- **Protocol:** HTTP/HTTPS REST, TLS 1.0/1.1/1.2, password or API users (v7.1+).
- **Scope:** Playback, playlist, scheduler, library, tags, artwork, encoder, song requests, system status.
- **Encoding:** UTF-8 for all text (Thai support TH-015).

---

## Localization Architecture (Thai)

### Principles (PRD §21)

1. **Unicode:** Thai block U+0E00–U+0E7F in all text inputs, displays, paths, exports.
2. **Encoding:** UTF-8 for storage, API, and file I/O.
3. **Fonts:** Desktop fallback chain (e.g. Tahoma, Leelawadee UI, Sarabun New); web (e.g. Sarabun, Noto Sans Thai); PDF embedding for reports.
4. **Text layout:** Thai has no word spaces; use ICU or dictionary for line break/word segmentation. Support complex script shaping (combining characters).
5. **UI:** Allow for longer/shorter strings; avoid fixed-width assumptions.

### Suggested implementation

- **Desktop (RadioBOSS, RadioLogger, RadioCaster):** Resource files per language (e.g. `lang/th.ini` or equivalent), key-based strings, language selector in options.
- **Cloud (RadioBOSS Cloud, RadioBOSS.FM):** JSON or similar locale files, server- or client-side i18n, `lang` or `locale` query/cookie.
- **Reports/export:** Ensure PDF/XLS generators use UTF-8 and embed Thai-capable fonts (TH-006).

---

## Integration Points

| From | To | Integration |
|------|-----|-------------|
| RadioBOSS | RadioBOSS.FM / Icecast/Shoutcast | Stream output, metadata |
| RadioBOSS | External sites | Now Playing HTTP/FTP/file |
| RadioLogger | Storage / email | Recordings, silence alerts |
| RadioCaster | Icecast/Shoutcast/WMS | Live stream |
| RadioBOSS Cloud | Third-party | TuneIn, Twitter, HTTP hooks, widgets |
| All products | Remote Control API | Automation, monitoring, song requests |

---

## Security & Administration

- **User profiles** and **role-based access** per product.
- **Remote Control API:** Enable/disable, port, password, API users with limited rights.
- **Song Request API:** Controlled exposure for listener requests.
- **Multi-station:** Single PC, multiple independent stations (RadioBOSS).

---

## Cloudflare-First Implementation Scaffold

The current repository scaffold implements the web suite around Cloudflare and `vinext`:

- **`apps/console`, `apps/admin`, `apps/public`** run as `vinext` apps on Cloudflare Workers.
- **`workers/api`** owns the control plane, D1-backed CRUD APIs, queue consumer, R2 upload flow, and station provisioning workflow.
- **`workers/station-gateway`** owns one Durable Object per station for queue state, mode switches, alarms, and websocket fanout.
- **`containers/playout`** is the initial playout service boundary for the media plane.
- **`packages/contracts`, `packages/i18n`, `packages/ui`** keep domain models, Thai/English locale loading, and app chrome consistent across the repo.

This scaffold is intentionally Cloudflare-first but not feature-complete. See [cloudflare/ARCHITECTURE_APPENDIX.md](./cloudflare/ARCHITECTURE_APPENDIX.md) for the exact topology and current limitations.

---

## References

- PRD: [DJSoft.Net — Complete Product Requirements Document](../DJSoft.Net%20—%20Complete%20Product%20Requirements%20Document%20(Detailed%20Features).md)
- Roadmap: [DEVELOPMENT_ROADMAP.md](../DEVELOPMENT_ROADMAP.md)
- Thai spec: [THAI_LOCALIZATION_SPEC.md](./THAI_LOCALIZATION_SPEC.md)
