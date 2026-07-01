# FRAGGRID — project context (read this first)

This is an esports stats dashboard for CS2 + Valorant, built so far via chat
with Claude. Goal: grow it into a monetized platform (ads/subscriptions),
not just a hobby project — that constraint shaped several decisions below.

## What exists right now
- `index.html` — the full site. Single-file HTML/CSS/JS, no build step,
  no framework. Light theme (cool gray, not cream), dual accent system
  (orange = CS2, teal = Valorant), angular clipped-corner cards, a
  data-driven scrolling ticker, sortable player leaderboard, spotlight
  cursor (fine-pointer + motion-safe only).
- `scripts/fetch-data.js` — Node 18+ script (no npm deps). Pulls live
  matches/standings/teams from the PandaScore API and writes
  `data/cs2.json` / `data/valorant.json`. Server-side only — never put the
  API key in client-side code.
- `.github/workflows/update-data.yml` — runs the fetch script every 15 min
  via GitHub Actions, reading the key from a repo secret named
  `PANDASCORE_TOKEN`, and commits the refreshed JSON.
- `data/*.json` — currently sample placeholders until the workflow runs
  for real with a valid token.
- `README.md` — step-by-step non-technical setup instructions (GitHub
  upload → add secret → run workflow → deploy to Netlify).

## Data plan / what's confirmed
- **PandaScore** (pandascore.co) is the main data source. Free tier, no
  card required, ~1000 req/hr. Confirmed via their live API docs:
  - Free: matches (running/upcoming/past), tournament standings, team
    listings — for *both* CS2 (`/csgo/...` + `filter[videogame_title]=cs-2`)
    and Valorant (`/valorant/...`).
  - **Paid Historical plan required** for per-player stats (rating, ADR/ACS,
    K/D). That's why the Player Leaderboard panel is still sample data —
    it's clearly labeled as such in the UI, not hidden.
  - Commercial/monetized use is allowed on PandaScore (unlike some
    competitors) — only restriction is no betting-related use without
    talking to their sales team, and no reselling the raw data feed itself.
- **GRID Open Access** (grid.gg) — applied for separately as a free,
  *official* (server-sourced) data option for CS2, but explicitly scoped to
  pre-revenue projects. Once monetization is live, would need a
  conversation with GRID's sales team for a paid tier — no self-serve
  pricing exists for that.
- **Liquipedia API** — intentionally NOT used for the commercial path; its
  free tier disallows monetized use and paid pricing isn't self-serve.

## Person's stated constraints (worth keeping in mind)
- Primary goal is to **monetize this later** — already factored into the
  PandaScore-first decision above.
- Self-described as having **little to no coding experience** — prior
  Claude turns did all the actual code, with plain-language setup steps
  for account/secret/deploy actions. Keep that pattern: explain *what*
  a command does and *why*, not just hand over commands to paste blindly.

## Likely next steps
1. Get a real PandaScore API key into the GitHub repo secret
   (`PANDASCORE_TOKEN`) and confirm the Action runs cleanly.
2. Deploy to Netlify (or similar) and confirm live data renders correctly.
3. Decide whether to invest in PandaScore's paid Historical plan once
   ready to launch (unlocks the real player leaderboard).
4. Continue iterating on design/features per the person's direction.
