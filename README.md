# Radio Development — DJSoft.Net PRD & Development

This repository holds the **Product Requirements Document (PRD)** for the DJSoft.Net radio suite and the **development planning** derived from it. Use it as the single source of truth for scope, roadmap, and implementation tasks.

---

## Contents

| Document | Purpose |
|----------|---------|
| [**DJSoft.Net — Complete Product Requirements Document (Detailed Features).md**](./DJSoft.Net%20—%20Complete%20Product%20Requirements%20Document%20(Detailed%20Features).md) | Full PRD: RadioBOSS, RadioLogger, RadioCaster, RadioBOSS.FM, RadioBOSS Cloud, and Thai localization. |
| [**DEVELOPMENT_ROADMAP.md**](./DEVELOPMENT_ROADMAP.md) | Phased development plan, priorities, and deliverables. |
| [**docs/ARCHITECTURE.md**](./docs/ARCHITECTURE.md) | High-level architecture and module boundaries. |
| [**docs/cloudflare/ARCHITECTURE_APPENDIX.md**](./docs/cloudflare/ARCHITECTURE_APPENDIX.md) | Cloudflare and `vinext` implementation scaffold, bindings, and repo topology. |
| [**docs/THAI_LOCALIZATION_SPEC.md**](./docs/THAI_LOCALIZATION_SPEC.md) | Thai language technical spec and task breakdown. |
| [**docs/IMPLEMENTATION.md**](./docs/IMPLEMENTATION.md) | Implementation guide: locales, validation, demo. |
| [**docs/NEXT_DEVELOPMENT_PLAN.md**](./docs/NEXT_DEVELOPMENT_PLAN.md) | Next development plan: i18n sync, auth, D1, playout, e2e. |
| [**docs/cloudflare/D1_AND_PROVISIONING.md**](./docs/cloudflare/D1_AND_PROVISIONING.md) | D1 migrations and station provisioning. |
| [**docs/E2E_TESTING.md**](./docs/E2E_TESTING.md) | Playwright E2E tests and how to run them. |

---

## Implementation (Phase 1 — Thai)

- **`locales/en/`** and **`locales/th/`** — JSON locale files for **9 modules**: common, player, playlist, library, scheduler, streaming, ads, reports, errors. UTF-8; Thai translations for UI strings.
- **`scripts/validate_locales.py`** — Validates UTF-8, JSON, and key parity (en → th). Run: `python3 scripts/validate_locales.py`
- **`scripts/load_locales.py`** — Python loader: `get_locale('th')` returns `t('module.key')` with fallback to English.
- **`scripts/locale-loader.js`** — JS loader for web/Node: `loadLocale('th')` / `loadLocaleSync('th')` for same `t(key)` usage.
- **`demo/i18n-demo.html`** — Language switcher (English / ภาษาไทย) and Thai font (Sarabun). Serve with e.g. `python3 -m http.server 8000` and open `http://localhost:8000/demo/i18n-demo.html`.

See [docs/IMPLEMENTATION.md](./docs/IMPLEMENTATION.md) for adding strings and integrating with products.

---

## Products (from PRD)

- **RadioBOSS** — Radio automation (player, playlists, library, scheduler, streaming).
- **RadioLogger** — Recording and logging of broadcasts.
- **RadioCaster** — Live audio encoding and streaming.
- **RadioBOSS.FM** — Stream hosting service.
- **RadioBOSS Cloud** — Web-based radio automation.

**New feature:** Thai language (ภาษาไทย) support across all products (PRD §§18–23).

---

## Getting started

1. **Read the PRD** for full feature and requirement details.
2. **Follow the roadmap** — Start with **Phase 1** (foundation and Thai localization) in [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md).
3. **Use the Thai spec** — Implement and QA Thai using [docs/THAI_LOCALIZATION_SPEC.md](./docs/THAI_LOCALIZATION_SPEC.md) (encoding, fonts, layout, tasks, acceptance criteria).
4. **Reference architecture** — Use [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for module boundaries and integration points.

---

## Folder structure

```
Radio Development/
├── README.md
├── DEVELOPMENT_ROADMAP.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CONTRIBUTING.md
│   ├── IMPLEMENTATION.md
│   └── THAI_LOCALIZATION_SPEC.md
├── locales/
│   ├── en/             # English (9 modules)
│   └── th/             # Thai (ภาษาไทย)
├── scripts/
│   ├── validate_locales.py
│   ├── load_locales.py
│   └── locale-loader.js
├── demo/
│   └── i18n-demo.html
└── DJSoft.Net — Complete Product Requirements Document (Detailed Features).md
```

Optional future: `radioboss/`, `radiologger/`, `radiocaster/`, `cloud/` for product-specific code.

## Cloudflare / Vinext Scaffold

The repository now includes a Cloudflare-first application scaffold:

- `apps/console`, `apps/admin`, `apps/public` — `vinext` apps targeting Cloudflare Workers.
- `workers/api` — control-plane APIs, queue consumer, workflow entrypoint, D1 migrations.
- `workers/station-gateway` — Durable Object backed realtime station state.
- `containers/playout` — playout service with `GET /stations/:id/live` (WAV stream); replace with ffmpeg for production.
- `packages/contracts`, `packages/i18n`, `packages/ui` — shared domain, locale, and UI packages.

- **Provision script** — `npm run provision` (or `CONTROL_API_URL=... node scripts/provision-station.mjs [tenantName] [stationName]`) to create a tenant and station via the control API.
- **E2E** — `npm run test:e2e` runs Playwright tests (Public app by default; Console, Admin, API, Playout when `BASE_URL_*` are set). See [docs/E2E_TESTING.md](./docs/E2E_TESTING.md) for the full test list and env vars.

See [docs/cloudflare/ARCHITECTURE_APPENDIX.md](./docs/cloudflare/ARCHITECTURE_APPENDIX.md) for the binding map and current implementation boundaries.

---

## References

- PRD references (URLs) are listed at the end of the main PRD file.
- System requirements: Windows 7 SP1+, 2 GHz 2 cores, 1 GB RAM, 1 GB disk (see PRD §§12, 14, 15).
