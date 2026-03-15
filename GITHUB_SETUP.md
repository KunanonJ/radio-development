# Create GitHub repo and push (KunanonJ)

Your local Git repo is ready. Create the repository on [GitHub](https://github.com/KunanonJ) and push using one of the options below.

---

## Option A: Create repo on GitHub, then push

1. **Create the repository**
   - Go to [https://github.com/new](https://github.com/new).
   - **Owner:** `KunanonJ`.
   - **Repository name:** e.g. `radio-development` (or any name you prefer).
   - **Description:** e.g. `DJSoft.Net PRD, roadmap, and Thai localization — Radio Development`.
   - Choose **Public** (or Private).
   - **Do not** add a README, .gitignore, or license (this project already has them).
   - Click **Create repository**.

2. **Connect and push** (if you used `radio-development`):
   ```bash
   cd "/Users/kunanonjarat/Desktop/Radio Development"
   git remote add origin https://github.com/KunanonJ/radio-development.git
   git push -u origin main
   ```
   If you used a different repo name, replace `radio-development` in the URL with your repo name.

---

## Option B: Use GitHub CLI (after re-authenticating)

Your `gh` token is currently invalid. Re-authenticate, then create the repo and push:

```bash
gh auth login -h github.com
```

Then:

```bash
cd "/Users/kunanonjarat/Desktop/Radio Development"
gh repo create radio-development --public --source=. --remote=origin --push --description "DJSoft.Net PRD, roadmap, and Thai localization — Radio Development"
```

This creates **https://github.com/KunanonJ/radio-development** and pushes `main`.

---

## Remote URL

- **HTTPS:** `https://github.com/KunanonJ/radio-development.git`
- **SSH (if you use SSH keys):** `git@github.com:KunanonJ/radio-development.git`

To switch to SSH:
```bash
git remote set-url origin git@github.com:KunanonJ/radio-development.git
```
