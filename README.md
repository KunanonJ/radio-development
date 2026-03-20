# The Urban Radio

The Urban Radio is a Firebase-backed, cloud-first radio automation platform. This repository contains the initial implementation scaffold for:

- The Urban Radio Cloud
- The Urban Radio FM
- Managed live ingest/encoding services
- Managed recording/logging services
- Thai-ready localization, reporting, and search support

## Workspace Layout

```text
apps/web              Next.js web app for Cloud, FM, docs, and widgets
functions             Firebase Functions control plane
packages/contracts    Shared domain models and API contracts
packages/i18n         Locale metadata and translation helpers
packages/ui           Shared React UI primitives
workers/automation    Go worker for playout, relay, and recording orchestration
workers/indexer       Go worker for Algolia + Thai indexing preparation
infra/terraform       Terraform starter modules for Firebase/GCP resources
docs                  Architecture and implementation notes
tests                 Unit tests for shared contracts and i18n behavior
```

## Architecture

- `Next.js 15` + `TypeScript` for the web application
- `Firebase Auth`, `Firestore`, `Cloud Storage`, `Cloud Functions`, `Hosting`
- `Cloud Run` Go workers for long-running media and indexing jobs
- `Pub/Sub` for async dispatch and `Cloud Scheduler` for recurring operations
- `Algolia` for search and Thai-aware indexing

## Local Development

0. Use Node `20` or `22` for emulator work. The repo includes `.nvmrc` and the Firebase CLI wrapper will fall back to Node 22 automatically when possible.
1. Install dependencies: `npm install`
2. Start Firebase emulators: `npm run dev:emulators`
3. Run the web app: `npm run dev:web`
4. Run the automation worker: `npm run dev:worker:automation`
5. Run the indexer worker: `npm run dev:worker:indexer`
6. Run tests: `npm test`
7. Run Go worker tests: `npm run test:go`

See [docs/LOCAL_DEVELOPMENT.md](./docs/LOCAL_DEVELOPMENT.md) for the full local end-to-end runbook.

## Notes

- The previous Cloudflare-specific scaffold is intentionally not reused.
- Desktop apps are out of scope for this implementation.
- Thai localization support is treated as a first-class platform concern.
- Stripe billing secrets belong in `.env.local` or a secret manager, never in tracked files.
