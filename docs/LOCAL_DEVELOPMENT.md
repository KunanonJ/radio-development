# Local End-to-End Runbook

## Prerequisites

- Node.js 20 or 22
- Go 1.22+
- Firebase CLI available through the local dev dependency or global install

If your machine is on an unsupported Node major, `npm run dev:emulators` will try to launch the local Firebase CLI through `node@22` via `npx`.

## Environment

1. Copy `.env.example` to `.env.local`.
2. Keep `DEV_BOOTSTRAP_ENABLED=false` to require real Firebase Auth in local development.
3. Keep emulator host values unchanged unless ports are already taken.
4. Put Stripe keys only in `.env.local`, never in tracked files.
5. Prefer Stripe test keys for local development. If a live secret key has been exposed in chat, logs, or screenshots, rotate it in Stripe before using it.

## Fixed Local Ports

- Next.js web app: `3000`
- Firebase Emulator UI: `4000`
- Functions emulator: `5001`
- Firestore emulator: `8080`
- Pub/Sub emulator: `8085`
- Auth emulator: `9099`
- Storage emulator: `9199`
- Automation worker: `8086`
- Indexer worker: `8087`

## Startup Flow

1. `npm install`
2. `npm run dev:emulators`
3. `npm run dev:web`
4. `npm run dev:worker:automation`
5. `npm run dev:worker:indexer`
6. `npm run test:e2e`

## First End-to-End User Journey

1. Open `http://127.0.0.1:3000/fm`
2. Create or sign into an emulator-backed email/password account
3. Submit the provisioning form
4. Confirm the created station appears in the station summary and realtime list
5. Confirm the worker command moves from `pending` to `completed`
6. Confirm worker status shows a healthy heartbeat

## Stripe Setup

1. Add these values to `.env.local`:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRICE_STARTER_MONTHLY`
   - `STRIPE_PRICE_GROWTH_MONTHLY`
   - `STRIPE_PRICE_BROADCAST_MONTHLY`
   - `STRIPE_CHECKOUT_SUCCESS_URL`
   - `STRIPE_CHECKOUT_CANCEL_URL`
   - `STRIPE_BILLING_PORTAL_RETURN_URL`
2. Create one recurring Stripe price for each plan: `starter`, `growth`, `broadcast`.
3. Forward Stripe webhooks to the local Functions endpoint for `stripeWebhook`.
4. Open `/fm`, provision a station, start checkout, and confirm the billing panel updates after the webhook lands.

## Resetting Local State

- Stop all processes
- Clear emulator data if you want a clean rerun
- Restart the same command sequence above
