# Thai Language Support — Technical Spec & Task Breakdown

This document translates PRD §§18–23 (Thai Language Support) into technical specifications and a concrete task list for development and QA.

---

## 1. Unicode & Encoding (PRD §21.1)

| Rule | Requirement |
|------|-------------|
| **Character set** | Full support for Thai Unicode block U+0E00–U+0E7F in every text input, display, file path, and export. |
| **Storage & I/O** | UTF-8 only for internal storage, API, and file I/O. |
| **API** | Requests and responses already UTF-8; verify no double-encoding or wrong code pages. |

**Tasks:**

- [ ] **TH-ENC-1** Audit all file read/write (playlists, library DB, config, export) for encoding; set UTF-8 where missing.
- [ ] **TH-ENC-2** Ensure HTTP/FTP/text/XML “Now Playing” export is UTF-8 (TH-010).
- [ ] **TH-ENC-3** Verify Remote Control API responses return Thai correctly in UTF-8 (TH-015).

---

## 2. Fonts (PRD §21.2)

| Context | Requirement |
|---------|-------------|
| **Desktop** | System or bundled fonts that support Thai: Tahoma, Leelawadee UI, Sarabun New. Define fallback chain. |
| **Web (Cloud / FM)** | Web fonts with Thai: e.g. Sarabun, Noto Sans Thai (Google Fonts). Include in CSS. |
| **PDF reports** | Embed Thai-capable font in generated PDFs so Thai renders on any system (TH-006). |

**Tasks:**

- [ ] **TH-FONT-1** Document and implement desktop font fallback chain for all UI controls.
- [ ] **TH-FONT-2** Add Thai web font(s) to RadioBOSS Cloud and RadioBOSS.FM CSS.
- [ ] **TH-FONT-3** Update Report Generator PDF export to embed a Thai-capable font and use it for Thai text.

---

## 3. Text Layout & Rendering (PRD §21.3)

| Consideration | Action |
|---------------|--------|
| **No spaces between words** | Use ICU or Thai word-break dictionary for line breaking and search tokenization. |
| **Combining characters** | Ensure rendering engine supports complex script shaping (vowels, tone marks). |
| **UI layout** | Allow for longer/shorter Thai strings; avoid fixed widths; test truncation and overflow. |

**Tasks:**

- [ ] **TH-LAYOUT-1** Enable Thai-aware line breaking in report and any rich-text views (ICU or equivalent).
- [ ] **TH-LAYOUT-2** Music Library search and indexing: Thai tokenization/segmentation (TH-014).
- [ ] **TH-LAYOUT-3** UI audit: resize/expand controls where Thai strings overflow (playlist, library, Cart Wall, dialogs).

---

## 4. Requirement-to-Task Map (PRD §20)

| Req ID | Short name | Task IDs | Priority |
|--------|------------|----------|----------|
| TH-001 | RadioBOSS UI | TH-UI-1 | High |
| TH-002 | RadioLogger UI | TH-UI-2 | High |
| TH-003 | RadioCaster UI | TH-UI-3 | High |
| TH-004 | RadioBOSS Cloud panel | TH-UI-4 | Medium |
| TH-005 | Thai in content fields | TH-ENC-1, TH-FONT-1, TH-LAYOUT-3 | High |
| TH-006 | Report Generator Thai | TH-FONT-3, TH-REP-1 | Medium |
| TH-007 | TTS Thai | TH-TTS-1 | Medium |
| TH-008 | Thai documentation | TH-DOC-1 | Low |
| TH-009 | Thai time voice pack | TH-TTS-2 | Low |
| TH-010 | Thai metadata export | TH-ENC-2 | High |
| TH-011 | Thai locale formatting | TH-LOCALE-1 | Medium |
| TH-012 | Thai language selector | TH-UI-0 | High |
| TH-013 | Cart Wall Thai labels | TH-LAYOUT-3, TH-UI-1 | Medium |
| TH-014 | Thai search & indexing | TH-LAYOUT-2 | High |
| TH-015 | API Thai responses | TH-ENC-3 | Medium |
| TH-016 | Installer Thai | TH-INST-1 | Low |

---

## 5. Detailed Task List

### 5.1 Language selector & infrastructure

- [ ] **TH-UI-0** Add “ภาษาไทย” to language/preferences in RadioBOSS, RadioLogger, RadioCaster. Apply locale immediately or after restart. Persist selection.

### 5.2 UI translation (string collection & translation)

- [ ] **TH-UI-1** Extract all RadioBOSS UI strings; create Thai resource file; translate menus, dialogs, context menus, tooltips, status/error messages (TH-001).
- [ ] **TH-UI-2** Same for RadioLogger (TH-002).
- [ ] **TH-UI-3** Same for RadioCaster (TH-003).
- [ ] **TH-UI-4** Thai locale for RadioBOSS Cloud web panel (TH-004).

### 5.3 Reports & export

- [ ] **TH-REP-1** Report Generator: Thai column headers, labels, and data in XLS/PDF; correct fonts and encoding (TH-006).

### 5.4 TTS & voice

- [ ] **TH-TTS-1** Add Thai language option to TTS engine; validate pronunciation for time/weather (TH-007).
- [ ] **TH-TTS-2** Create or integrate Thai time-announcement voice pack (TH-009).

### 5.5 Locale & formatting

- [ ] **TH-LOCALE-1** Thai locale for date/time in scheduler, reports, logs; optional Buddhist Era (พ.ศ.) (TH-011).

### 5.6 Installer

- [ ] **TH-INST-1** Add Thai to installation wizard for RadioBOSS, RadioLogger, RadioCaster (TH-016).

### 5.7 Documentation

- [ ] **TH-DOC-1** Translate user manuals (PDF and online) for RadioBOSS, RadioLogger, RadioCaster into Thai (TH-008).

---

## 6. Translation Process (PRD §21.4)

- Use existing community translation framework and resource format.
- Native Thai translator produces first draft.
- Second native Thai speaker reviews for accuracy and natural phrasing.
- Store translations in version-controlled resource files (e.g. `lang/th.*` or `locales/th/`).

---

## 7. Testing (PRD §21.5 & §22)

### 7.1 QA checklist

- [ ] All UI elements display correctly in Thai (no truncation, overlap, or rendering bugs).
- [ ] Thai in metadata, playlist names, comments, reports: correct in all views and exports (XLS, PDF, XML, HTTP).
- [ ] TTS Thai: intelligible and correct pronunciation.
- [ ] Music Library search and indexing: correct results for Thai queries.
- [ ] API responses: Thai characters correctly encoded (UTF-8).
- [ ] Cart Wall: Thai labels render correctly.
- [ ] RadioBOSS Cloud: full Thai experience on major browsers and mobile.

### 7.2 Acceptance criteria (PRD §22)

All 10 acceptance criteria in PRD §22 must be verified and signed off (by product owner or QA) before closing the Thai feature.

---

## 8. Sprint Suggestion (Phase 1)

**Sprint 1 (2 weeks)**  
- TH-ENC-1, TH-ENC-2, TH-UI-0, TH-FONT-1.  
- Begin TH-UI-1 (string extraction for RadioBOSS).

**Sprint 2 (2 weeks)**  
- TH-UI-1 completion; TH-UI-2, TH-UI-3.  
- TH-LAYOUT-2 (search/indexing Thai), TH-LAYOUT-3 (UI overflow audit).

**Sprint 3 (2 weeks)**  
- TH-ENC-3, TH-FONT-3, TH-REP-1, TH-LOCALE-1.  
- TH-UI-4 (Cloud panel) if resources allow.  
- QA pass against §22.

---

## 9. References

- PRD Thai section: PRD §§18–23.
- Roadmap: [DEVELOPMENT_ROADMAP.md](../DEVELOPMENT_ROADMAP.md).
- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md).
