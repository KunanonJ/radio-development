# Contributing to Radio Development (DJSoft.Net)

This guide helps contributors align with the PRD and the development process.

---

## 1. Scope and sources of truth

- **Scope** is defined in the [Complete Product Requirements Document (PRD)](../DJSoft.Net%20—%20Complete%20Product%20Requirements%20Document%20(Detailed%20Features).md).
- **Priorities and phases** are in [DEVELOPMENT_ROADMAP.md](../DEVELOPMENT_ROADMAP.md).
- **Architecture** is summarized in [ARCHITECTURE.md](./ARCHITECTURE.md).
- **Thai localization** is specified in [THAI_LOCALIZATION_SPEC.md](./THAI_LOCALIZATION_SPEC.md).

Before implementing a feature, confirm it appears in the PRD and in the appropriate phase of the roadmap.

---

## 2. Thai localization contributions

- **Strings:** Use the existing localization resource format (e.g. key-value or per-module files). Keys should be stable; only add or deprecate with care.
- **Encoding:** All new or modified text resources and exports must be UTF-8. No legacy code pages for Thai.
- **Review:** Thai UI and documentation should be reviewed by a second native Thai speaker for accuracy and natural phrasing (PRD §21.4).
- **Tasks:** Pick from the task list in [THAI_LOCALIZATION_SPEC.md](./THAI_LOCALIZATION_SPEC.md) and track completion (e.g. in issues or project board).

---

## 3. Code and quality

- **Desktop (RadioBOSS, RadioLogger, RadioCaster):** Follow existing Windows desktop conventions, including system requirements (PRD §§12, 14, 15).
- **Web (RadioBOSS Cloud, RadioBOSS.FM):** Ensure responsive, accessible UIs and UTF-8 for all user-facing text and APIs.
- **APIs:** Remote Control API and Song Request API must use UTF-8 for requests and responses (Thai support TH-010, TH-015).
- **Reports:** Report Generator exports (XLS, PDF) must support Thai text with correct fonts and encoding (TH-006).

---

## 4. Testing

- **Thai feature:** Run through the QA checklist and acceptance criteria in [THAI_LOCALIZATION_SPEC.md](./THAI_LOCALIZATION_SPEC.md) (§7 and §8) and PRD §22.
- **Regression:** New changes should not break existing behavior; run relevant smoke tests for Player, Playlist Generator, Library, Scheduler, Streaming, and Reports as applicable.

---

## 5. Documentation

- Update [DEVELOPMENT_ROADMAP.md](../DEVELOPMENT_ROADMAP.md) when phases or deliverables change.
- Document architecture or API changes in [ARCHITECTURE.md](./ARCHITECTURE.md).
- Keep [THAI_LOCALIZATION_SPEC.md](./THAI_LOCALIZATION_SPEC.md) in sync with implementation (new tasks, completed items, known issues).

---

## 6. Questions

- **Product/scope:** Refer to the PRD and roadmap.
- **Thai implementation:** Refer to THAI_LOCALIZATION_SPEC and PRD §§18–23.
- **Integration:** Refer to ARCHITECTURE and the PRD sections for Streaming, API, and Cloud.
