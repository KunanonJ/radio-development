# Cloudflare Workers Builds (this repo)

Use this checklist when the Git-connected build runs **build** + **deploy** on Cloudflare (not plain Pages-only upload).

## 1. Commands (dashboard)

| Step | Value |
|------|--------|
| **Build command** | `bun run build` or `npm run build` |
| **Deploy command** | `bun run deploy` or `npm run deploy` or `npx wrangler pages deploy dist` |
| **Override project slug (optional)** | Set **`CF_PAGES_PROJECT_NAME`** in build env (e.g. `radio-development`) — `npm run deploy` runs `scripts/pages-deploy.mjs` and passes **`--project-name`** when set. Otherwise **`name`** in `wrangler.toml` is used. |
| **Non-production / preview deploy** | Same as production — **`bun run deploy`**. Do **not** use `npx wrangler versions upload` (Workers-only). |
| **Output directory** | `dist` (Vite; matches `pages_build_output_dir` in `wrangler.toml`) |

Never use **`npx wrangler deploy`** (Workers). This project is **Pages** + **Pages Functions** (`functions/`).

## 2. `wrangler.toml` must match the dashboard

- **`name`** = Cloudflare **Pages project slug** (must match the name in **`wrangler pages project list`** / dashboard URL). This repo uses **`homeseeker`** (sidebar name in your dashboard). If Cloudflare suggested `radio-development`, that only applies if the Pages project was **created** with that slug — otherwise deploy targets the wrong project or fails.
- **Account** is **not** set in `wrangler.toml` for Pages — **`account_id` is invalid** there and deploy will fail validation. Use a token / linked Git project scoped to account **`8724aa41…`** (homeseeker) as needed.
- Repo values are the source of truth for `wrangler pages deploy`.

## 3. `CLOUDFLARE_API_TOKEN` (fixes Authentication error `[10000]`)

**Important:** Dashboard roles (e.g. Super Administrator) do **not** apply to **API tokens**. A token can list your account in `wrangler whoami` but still **lack** **Cloudflare Pages** permissions — you get **`Authentication error [code: 10000]`** on `POST/GET .../pages/projects/...`.

### Create a token that can run `wrangler pages deploy`

1. Cloudflare → **My Profile** → **API Tokens** → **Create Token** → **Create Custom Token**.
2. **Permissions** (minimum):
   - **Account** → **Cloudflare Pages** → **Edit**
3. **Account Resources**:
   - **Include** → **Specific account** → **homeseeker** (`8724aa41ebe346f0cbd1c62126fe8942`).
4. Create token, copy the value once.

Optional: template **“Edit Cloudflare Workers”** often includes Pages — open the template and **confirm** **Cloudflare Pages → Edit** appears before using it.

### Put the token where Workers Builds reads it

1. **Workers & Pages** → your project → **Settings** → **Environment variables** (or **Variables and Secrets** for builds).
2. Set **`CLOUDFLARE_API_TOKEN`** = the new token (replace any old token that only had Workers or DNS scopes).
3. Save and **redeploy**.

### Verify project name locally (optional)

```bash
npx wrangler login
npm run cf:pages:list
```

Use the **`name`** column **exactly** in `wrangler.toml` (`name = "..."`).

## 4. URLs

- Account Workers subdomain (account-level): e.g. `urbanradio.workers.dev`.
- Pages preview/production: typically **`https://<pages-project-name>.pages.dev`** or a **custom domain** attached in the Pages project.

## 5. Troubleshooting

| Symptom | Likely fix |
|---------|------------|
| `Missing entry-point` | Deploy command was `wrangler deploy` → switch to **`bun run deploy`**. |
| `Authentication error [10000]` | Token missing **Cloudflare Pages → Edit** (see §3). Replace **`CLOUDFLARE_API_TOKEN`** in build env — not fixable by repo YAML alone. |
| API path `/pages/projects/<wrong-name>` | Run **`npm run cf:pages:list`**; set **`name`** in `wrangler.toml` to that slug exactly. |
| `glob@10.5.0` npm warning | Transitive (**Tailwind** → **sucrase**). Harmless until those packages bump `glob`; do not fail the build. |

## 6. Alternative: deploy from GitHub Actions (if Cloudflare’s `CLOUDFLARE_API_TOKEN` cannot be fixed)

Cloudflare’s build environment may inject or reuse a token that **never** gets **Pages → Edit**. You can deploy from **GitHub** instead:

1. Create an API token (same as §3): **Account** → **Cloudflare Pages** → **Edit**, account **homeseeker**.
2. In GitHub: **Settings** → **Secrets and variables** → **Actions** → **New repository secret** → name **`CLOUDFLARE_API_TOKEN`**, paste the token.
3. Optional: **Variables** → **`CF_PAGES_PROJECT_NAME`** if the slug must differ from `wrangler.toml` **`name`**.
4. **Actions** → **Deploy Cloudflare Pages** → **Run workflow** (`.github/workflows/deploy-cloudflare-pages.yml`).

Then either fix the Cloudflare build token later or **clear the Deploy command** in Cloudflare (if the product allows publishing **`dist`** without Wrangler) so you are not running two deploy paths on every push.
