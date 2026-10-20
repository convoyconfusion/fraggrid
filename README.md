# FRAGGRID

An esports stats and news platform for **CS2, Valorant, BGMI and PUBG Mobile**: live and upcoming matches, league standings, tournament player stats, prize pools and editorial coverage in one place.

**Live site:** _add your Vercel link here_

## Features

- **Live match data for CS2 and Valorant**, synced from the PandaScore API every 15 minutes by a scheduled job
- **Standings, tournaments and player stats** on dedicated pages for each game
- **News section** with articles written and published through a headless CMS
- **BGMI and PUBG Mobile** data curated by editors in the CMS, since no reliable live feed exists for those titles
- Responsive, broadcast-HUD style interface with scroll reveals and motion effects

## Tech stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion · Sanity CMS (GROQ) · PandaScore REST API · Vercel (hosting + Cron Jobs)

## Architecture

```
PandaScore API ──(every 15 min, Vercel Cron)──▶ /api/sync/pandascore ──▶ Sanity CMS
                                                                          │
Editors (Sanity Studio at /studio) ── articles, BGMI/PUBGM data ──────────┤
                                                                          ▼
                                                        Next.js pages (server components)
```

- **Sync route** (`web/src/app/api/sync/pandascore/route.ts`): fetches matches, standings and tournaments for CS2 and Valorant, reshapes them, and upserts them into Sanity. It is protected by a `CRON_SECRET` bearer token so only the scheduler can trigger it, and it patches only API-sourced fields so editor-entered player stats survive each sync.
- **Data layer** (`web/src/lib/data.ts`): GROQ queries that pages use to read game data, tournaments and articles from Sanity.
- **Dynamic routes**: `/[game]`, `/[game]/tournaments/[slug]`, `/news` and `/news/[slug]`.
- **Content models** (`web/src/sanity/schemaTypes/`): article, author, tournament and game data.
- **Secrets** (PandaScore and Sanity tokens) live only in server-side environment variables, never in client code.

## Project structure

```
web/                Next.js app (the live site)
├── src/app/        routes, layouts and the sync API route
├── src/components/ match cards, standings and stats tables, header/footer
├── src/lib/        data fetching, game config, shared types
├── src/sanity/     CMS client and content schemas
└── scripts/        one-off script to seed Sanity with sample data
index.html, react-nav/, scripts/, data/   earlier prototypes (static HTML version and a React navigation experiment)
```

## Run locally

```bash
cd web
cp .env.local.example .env.local   # fill in Sanity and PandaScore values
npm install
npm run dev
```

## Roadmap

- Real player leaderboards (requires PandaScore's paid historical data plan)
- Live data for BGMI and PUBG Mobile once a reliable source is available
- User accounts with favourite teams and match alerts
