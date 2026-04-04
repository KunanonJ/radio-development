# Cloudflare Workers Builds (this repo)

Use this checklist when the Git-connected build runs **build** + **deploy** on Cloudflare (not plain Pages-only upload).

## 1. Commands (dashboard)

| Step | Value |
|------|--------|
| **Build command** | `bun run build` or `npm run build` |
| **Deploy command** | `bun run deploy` or `npm run deploy` or `npx wrangler pages deploy dist` |
| **Non-production / preview deploy** | Same as production — **`bun run deploy`**. Do **not** use `npx wrangler versions upload` (Workers-only). |
| **Output directory** | `dist` (Vite; matches `pages_build_output_dir` in `wrangler.toml`) |

Never use **`npx wrangler deploy`** (Workers). This project is **Pages** + **Pages Functions** (`functions/`).

## 2. `wrangler.toml` must match the dashboard

- **`name`** = Cloudflare **Pages project name** (e.g. `homeseeker`).
- **`account_id`** = Your Cloudflare account ID (see Workers & Pages overview).
- Repo values are the source of truth for `wrangler pages deploy`.

## 3. `CLOUDFLARE_API_TOKEN` (fixes Authentication error `[10000]`)

Workers Builds injects **`CLOUDFLARE_API_TOKEN`**. The token must be allowed to manage **Pages** for that account.

1. Cloudflare Dashboard → **My Profile** → **API Tokens** → **Create Token**.
2. Use template **“Edit Cloudflare Workers”** (includes **Account → Cloudflare Pages → Edit**), or create custom with at least:
   - **Account** → **Cloudflare Pages** → **Edit**
   - Scope: account **`8724aa41ebe346f0cbd1c62126fe8942`** (or “All accounts” while testing).
3. In **Workers & Pages** → your project → **Settings** → **Environment variables** (or Workers Builds secrets), set **`CLOUDFLARE_API_TOKEN`** to that token value.
4. Redeploy.

If deploy still fails, rotate the token and confirm it is not expired and not restricted to the wrong account.

## 4. URLs

- Account Workers subdomain (account-level): e.g. `urbanradio.workers.dev`.
- Pages preview/production: typically **`https://<pages-project-name>.pages.dev`** or a **custom domain** attached in the Pages project.

## 5. Troubleshooting

| Symptom | Likely fix |
|---------|------------|
| `Missing entry-point` | Deploy command was `wrangler deploy` → switch to **`bun run deploy`**. |
| `Authentication error [10000]` | Token scopes or wrong account → recreate token (Pages: Edit) and set **`CLOUDFLARE_API_TOKEN`**. |
| API path `/pages/projects/<wrong-name>` | Align **`name`** in `wrangler.toml` with the Pages project name. |
| `glob@10.5.0` npm warning | Transitive (**Tailwind** → **sucrase**). Harmless until those packages bump `glob`; do not fail the build. |
