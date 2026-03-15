# Radio Development — DJSoft.Net PRD & Development

This repository holds the **Product Requirements Document (PRD)** for the DJSoft.Net radio suite and the **development planning** derived from it. Use it as the single source of truth for scope, roadmap, and implementation tasks.

---

## Contents

| Document | Purpose |
|----------|---------|
| [**DJSoft.Net — Complete Product Requirements Document (Detailed Features).md**](./DJSoft.Net%20—%20Complete%20Product%20Requirements%20Document%20(Detailed%20Features).md) | Full PRD: RadioBOSS, RadioLogger, RadioCaster, RadioBOSS.FM, RadioBOSS Cloud, and Thai localization. |
| [**DEVELOPMENT_ROADMAP.md**](./DEVELOPMENT_ROADMAP.md) | Phased development plan, priorities, and deliverables. |
| [**docs/ARCHITECTURE.md**](./docs/ARCHITECTURE.md) | High-level architecture and module boundaries. |
| [**docs/THAI_LOCALIZATION_SPEC.md**](./docs/THAI_LOCALIZATION_SPEC.md) | Thai language technical spec and task breakdown. |

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

## Suggested folder structure (future code)

When adding code or assets, you may organize as:

```
Radio Development/
├── README.md
├── DEVELOPMENT_ROADMAP.md
├── docs/
│   ├── ARCHITECTURE.md
│   └── THAI_LOCALIZATION_SPEC.md
├── prd/
│   └── DJSoft.Net — Complete Product Requirements Document (Detailed Features).md
├── radioboss/          # (if developing RadioBOSS-related code)
├── radiologger/        # (if developing RadioLogger-related code)
├── radiocaster/        # (if developing RadioCaster-related code)
├── cloud/              # (if developing RadioBOSS Cloud / FM)
└── locales/            # Thai (and other) localization resources
    └── th/
```

The PRD and docs are the authority; adjust folders to match your actual repos and build system.

---

## References

- PRD references (URLs) are listed at the end of the main PRD file.
- System requirements: Windows 7 SP1+, 2 GHz 2 cores, 1 GB RAM, 1 GB disk (see PRD §§12, 14, 15).
