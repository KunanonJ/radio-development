# Implementation Guide

This document describes the current implementation for **Phase 1: Thai localization** and how to extend it.

---

## What’s implemented

### 1. Locale structure (`locales/`)

- **`locales/en/`** — English source strings (reference).
- **`locales/th/`** — Thai translations (ภาษาไทย).

Each module is a JSON file (UTF-8):

| Module    | File            | Purpose                          |
|-----------|-----------------|----------------------------------|
| Common    | `common.json`   | App name, language, buttons, etc.|
| Player    | `player.json`   | Player UI (PRD §1)               |
| Playlist  | `playlist.json` | Playlist generator (PRD §2)     |
| Library   | `library.json`  | Music library (PRD §3)          |
| Scheduler | `scheduler.json`| Scheduler (PRD §4)               |
| Streaming | `streaming.json`| Broadcasting (PRD §6)            |
| Ads       | `ads.json`      | Advertisement scheduler (PRD §5)|
| Reports   | `reports.json`  | Report generator (PRD §7)       |
| Errors    | `errors.json`   | Error/status messages            |

Keys follow `module.key`. Values are plain strings. `_meta` is reserved for module/language.

### 4. Locale loaders

- **Python** — `scripts/load_locales.py`
  - `get_locale(lang, fallback_lang='en')` returns `t(key)` (e.g. `t('common.ok')`, `t('errors.file_not_found')`). Use from app: run from repo root or add `scripts` to `PYTHONPATH`.
  - `get_all_strings(lang)` returns a flat dict of all keys for export/debugging.
  - CLI: `python3 scripts/load_locales.py th` prints sample keys.

- **JavaScript** — `scripts/locale-loader.js`
  - **Async (browser):** `loadLocale('th', { baseUrl: '/locales' })` returns a Promise that resolves to `t(key)`.
  - **Sync (Node):** `loadLocaleSync('th', { localesDir: path.join(__dirname, 'locales') })` returns `t(key)`.
  - Fallback to English for missing keys.

### 2. Validation script

**`scripts/validate_locales.py`**

- Ensures all locale files are valid **UTF-8** and **JSON**.
- Checks **key parity**: every key in `en` exists in `th` (no missing translations for tracked keys).
- Run: `python3 scripts/validate_locales.py`

Use this in CI or before commits to catch encoding and missing-key issues.

### 3. i18n demo

**`demo/i18n-demo.html`**

- Loads `locales/en` and `locales/th` via `fetch`.
- Language switcher: English / ภาษาไทย.
- Renders sample strings from all modules using **Sarabun** for Thai (PRD §21.2).
- Served over `file://` or any static server; use a local server if `fetch` to `../locales/` is blocked by CORS.

```bash
# From repo root (optional)
python3 -m http.server 8000
# Open http://localhost:8000/demo/i18n-demo.html
```

---

## How to add or change strings

1. **Add or edit keys in `locales/en/<module>.json`** (English is the source of truth for keys).
2. **Add or edit the same keys in `locales/th/<module>.json`** with Thai text.
3. Run `python3 scripts/validate_locales.py` to ensure parity and UTF-8.
4. If you use the demo, refresh and switch language to confirm.

Keep values in **UTF-8**. For Thai, use the Unicode block U+0E00–U+0E7F (no need to escape in JSON).

---

## Integrating with real products

- **Desktop (RadioBOSS, RadioLogger, RadioCaster):**  
  Export these JSON files to the format your app uses (e.g. INI, RESX, or embed JSON and look up by `module.key`). Use the same key names so translations stay in sync.

- **Web (RadioBOSS Cloud / FM):**  
  Serve `locales/<lang>/*.json` from the app and load them in the frontend (as in `demo/i18n-demo.html`). Set `lang` from user settings or `?lang=th`. Include a Thai-capable font (e.g. Sarabun, Noto Sans Thai) in CSS.

- **Language selector (TH-012):**  
  Persist the chosen language (e.g. `th` or `en`) in settings. On load, read the locale and apply it (immediately or after restart, as per product design).

---

## Task status (from THAI_LOCALIZATION_SPEC)

| Task        | Status   | Notes                                      |
|------------|----------|--------------------------------------------|
| Locale files (en/th) | Done   | 9 modules: common, player, playlist, library, scheduler, streaming, ads, reports, errors |
| Locale loaders       | Done   | Python: `load_locales.py`; JS: `locale-loader.js` |
| **@radioboss/i18n**  | Done   | All 9 modules; Vinext apps (console, admin, public) use them with `?lang=th`. |
| UTF-8 validation     | Done   | `scripts/validate_locales.py`             |
| Key parity (en → th)  | Done   | Same script                               |
| Thai font (web)      | Done   | Demo uses Sarabun                         |
| TH-UI-1 (RadioBOSS)  | Started | Keys align with PRD modules; full UI = full string set from app |
| TH-UI-0 (selector)   | Pending | Implement in each product’s settings UI   |

---

## References

- PRD: [DJSoft.Net — Complete Product Requirements Document (Detailed Features).md](../DJSoft.Net%20—%20Complete%20Product%20Requirements%20Document%20(Detailed%20Features).md) §§18–23  
- Thai spec: [THAI_LOCALIZATION_SPEC.md](./THAI_LOCALIZATION_SPEC.md)  
- Roadmap: [DEVELOPMENT_ROADMAP.md](../DEVELOPMENT_ROADMAP.md)
