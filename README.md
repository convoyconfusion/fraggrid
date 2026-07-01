# FRAGGRID — setup guide (no coding required)

This folder is your whole website + its live-data pipeline. You don't need to
write or edit any code — just follow these steps once.

## What's in here
- `index.html` — the website itself
- `data/cs2.json`, `data/valorant.json` — the live data the site reads (starts as sample data, gets overwritten automatically once it's live)
- `scripts/fetch-data.js` — the script that pulls fresh data from PandaScore
- `.github/workflows/update-data.yml` — tells GitHub to run that script every 15 minutes automatically

## Step 1 — Put this project on GitHub
1. Go to github.com and create a free account if you don't have one.
2. Click **New repository**. Name it whatever you like (e.g. `fraggrid`). Keep it **Public** (required for the free hosting in Step 3) or Private if you upgrade hosting later.
3. On the new repo page, use **"uploading an existing file"** and drag in everything from this folder, keeping the same folder structure (the `.github` and `data` and `scripts` folders need to come along, not just `index.html`).
4. Commit the files.

## Step 2 — Add your PandaScore key as a secret
Never paste your API key directly into any file — this step keeps it private.
1. In your new repo, go to **Settings → Secrets and variables → Actions**.
2. Click **New repository secret**.
3. Name: `PANDASCORE_TOKEN`
4. Value: paste your PandaScore API token (find it on your PandaScore dashboard).
5. Save.

## Step 3 — Turn on the live updates
1. Go to the **Actions** tab in your repo.
2. You should see a workflow called **"Update FRAGGRID data"**. Click it.
3. Click **Run workflow** (this triggers it manually the first time, instead of waiting 15 minutes).
4. After it finishes (usually under a minute), check the `data/` folder in your repo — `cs2.json` and `valorant.json` should now show real matches instead of the sample placeholders.

From now on, this runs automatically every 15 minutes — you don't need to touch it again.

## Step 4 — Put the site online
Easiest free option: **Netlify**.
1. Go to netlify.com, sign up, choose "Import an existing project from GitHub."
2. Pick your `fraggrid` repo. No build command needed — leave the build settings blank/default, since this is a plain HTML site.
3. Deploy. Netlify gives you a live URL in under a minute.

Whenever the GitHub Action updates `data/*.json`, redeploy on Netlify (or set up Netlify's auto-deploy-on-push, which is the default — so it just happens automatically).

## What's live vs. sample right now
- ✅ Live: match schedules/scores, league standings, team listings (CS2 + Valorant)
- 🔶 Sample only: the Player Leaderboard panel (ratings/ADR/K-D) — PandaScore's free tier doesn't include per-player stats. That needs their paid Historical plan.

## If something looks wrong
Open the Action run's log (Actions tab → click the run → click the job) — it
prints exactly what it fetched and any errors. Send that log back and it can
be debugged from there.
