# Project status — updates, pending, next steps

*Last updated from current implementation and roadmap.*

**→ For the next development cycle (i18n sync, auth, D1, playout, e2e), see [docs/NEXT_DEVELOPMENT_PLAN.md](docs/NEXT_DEVELOPMENT_PLAN.md).**

---

## What’s done (updates)

### Planning & docs
- **PRD** — Complete product requirements (RadioBOSS, RadioLogger, RadioCaster, RadioBOSS.FM, RadioBOSS Cloud + Thai).
- **DEVELOPMENT_ROADMAP.md** — Phases 1–5 defined; Phase 1 = Thai + foundation.
- **docs/ARCHITECTURE.md** — Module overview and integration points.
- **docs/THAI_LOCALIZATION_SPEC.md** — Thai technical spec and task list (TH-001–TH-016).
- **docs/IMPLEMENTATION.md** — How locales work and how to extend them.
- **Git** — Repo initialized; pushed to `https://github.com/KunanonJ/radio-development`.

### Phase 1 implementation (Thai foundation)
- **Locale structure** — `locales/en/` and `locales/th/` with **9 modules** (JSON, UTF-8): common, player, playlist, library, scheduler, **streaming**, **ads**, **reports**, **errors**.
- **Thai translations** — Full Thai (ภาษาไทย) for all modules (streaming/broadcasting, advertisement scheduler, report generator, error messages).
- **Validation script** — `scripts/validate_locales.py` checks UTF-8, JSON, and key parity (en → th).
- **Locale loaders** — `scripts/load_locales.py` (Python) and `scripts/locale-loader.js` (Node/browser) to load a language and resolve `t('module.key')` with fallback to English.
- **@radioboss/i18n** — All 9 modules wired; **console**, **admin**, and **public** Vinext apps use them (streaming, ads, reports, errors in nav and sections). TH-UI-4 (Cloud panel Thai) supported for current UI.
- **i18n demo** — `demo/i18n-demo.html` with English/ไทย switcher, Sarabun font, and cards for all 9 modules.

### Cloudflare / Vinext (Workstreams B–E)
- **Auth & widget tokens** — Console/admin middleware (Cloudflare Access JWT); widget token issuance (`POST /v1/stations/:id/widget-token`) and validation (`GET /v1/validate-widget?token=...`); Public app shows localized `errors.invalid_token` / `errors.token_expired` when `?token=...` is invalid or expired; `PUBLIC_WIDGET_ID` and token flow documented in ARCHITECTURE_APPENDIX.
- **Provision script** — `scripts/provision-station.mjs` and `npm run provision`; creates tenant + station and triggers provision workflow via control API; documented in D1_AND_PROVISIONING.md.
- **Playout** — `GET /stations/:id/live` streams real WAV audio (silence placeholder); replace with ffmpeg for production.
- **E2E** — Playwright suite in `e2e/`; `npm run test:e2e`; Public app i18n tests (en/th); see `docs/E2E_TESTING.md`.
- **Docs** — Presigned R2 uploads and Observability (Analytics Engine) documented in ARCHITECTURE_APPENDIX.

---

## Pending (not done yet)

### Phase 1 — Thai (high priority)
| Item | Description |
|------|-------------|
| **TH-UI-0** | Language selector “ภาษาไทย” in each product’s settings (persist, apply on load/restart). |
| **TH-UI-1** | Full RadioBOSS UI string set: extract from app, complete Thai resource file. |
| **TH-UI-2** | RadioLogger UI translation (full set). |
| **TH-UI-3** | RadioCaster UI translation (full set). |
| **TH-UI-4** | RadioBOSS Cloud web panel in Thai. |
| **TH-ENC-1/2/3** | UTF-8 audit for file I/O, Now Playing export, API responses. |
| **TH-FONT-1/2/3** | Desktop font fallback, web fonts, PDF report fonts. |
| **TH-LAYOUT-2/3** | Thai search/tokenization in Music Library; UI overflow audit. |
| **TH-REP-1** | Report Generator: Thai in XLS/PDF and fonts. |
| **TH-LOCALE-1** | Date/time formatting (Thai locale, optional Buddhist Era). |
| **TH-TTS-1/2** | TTS Thai option; Thai time-announcement voice pack. |
| **TH-INST-1** | Thai option in installers (optional). |
| **TH-DOC-1** | Thai user manuals (low priority). |
| **QA** | Full pass against PRD §22 acceptance criteria. |

### Phase 1 — Infrastructure (roadmap)
- [ ] I18n framework confirmed/added per product (resource format, fallback).
- [ ] UTF-8 enforced everywhere (storage, API, exports).
- [ ] Thai font stack documented and implemented (desktop + web + PDF).

### Phase 2–5 (later)
- Phase 2: RadioBOSS core (Player, Playlist Generator, Library, Scheduler, Streaming, Reports).
- Phase 3: RadioLogger, RadioCaster.
- Phase 4: RadioBOSS Cloud, RadioBOSS.FM.
- Phase 5: Thai medium/low items + polish.

---

## Next steps (recommended order)

1. **Expand locale coverage (this repo)**  
   Streaming, ads, reports, and errors modules are added. Add more keys to existing modules or new modules as needed. Run `python3 scripts/validate_locales.py` after changes.

2. **Integrate with real products**  
   If you have access to RadioBOSS/RadioLogger/RadioCaster/Cloud source:
   - Add “ภาษาไทย” to the language list and persist choice (TH-UI-0).
   - Load or convert our JSON locales into the app’s resource format.
   - Ensure all file/API I/O and Now Playing export use UTF-8 (TH-ENC-1, TH-ENC-2, TH-ENC-3).

3. **Full RadioBOSS string extraction**  
   Extract all UI strings from RadioBOSS into `locales/en` (and optionally a separate file per screen). Translate to Thai in `locales/th` (TH-UI-1). Repeat for RadioLogger (TH-UI-2) and RadioCaster (TH-UI-3).

4. **Thai search & fonts**  
   Implement or verify Thai-aware search/tokenization in Music Library (TH-LAYOUT-2). Document and apply Thai font stack for desktop and web (TH-FONT-1, TH-FONT-2); add Thai font embedding for Report Generator PDF (TH-FONT-3, TH-REP-1).

5. **QA and sign-off**  
   Run through the QA checklist in THAI_LOCALIZATION_SPEC §7 and all 10 acceptance criteria in PRD §22; fix issues and get sign-off.

---

## Quick reference

| I want to… | Do this |
|------------|--------|
| Run locale validation | `python3 scripts/validate_locales.py` |
| Try the Thai demo | `python3 -m http.server 8000` → open `http://localhost:8000/demo/i18n-demo.html` |
| Provision tenant + station | `CONTROL_API_URL=http://localhost:8787 npm run provision` (or `node scripts/provision-station.mjs "Tenant" "Station"`) |
| Run E2E tests | `npm run test:e2e`; set `BASE_URL_CONSOLE`, `BASE_URL_ADMIN`, `BASE_URL_API`, `BASE_URL_PLAYOUT` for full suite (see [docs/E2E_TESTING.md](docs/E2E_TESTING.md)) |
| Add/change UI strings | Edit `locales/en/<module>.json` and `locales/th/<module>.json`, then run validation. |
| Load locale in Python | `from load_locales import get_locale; t = get_locale('th'); t('common.ok')` (run from repo root or set PYTHONPATH). |
| Load locale in JS (web) | Use `loadLocale('th', { baseUrl: '/locales' })` from `scripts/locale-loader.js`. |
| See full task list | [docs/THAI_LOCALIZATION_SPEC.md](docs/THAI_LOCALIZATION_SPEC.md) |
| See phase plan | [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) |
| See how implementation works | [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md) |
