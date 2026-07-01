/**
 * FRAGGRID — data fetcher
 *
 * Pulls live CS2 + Valorant esports data from the PandaScore API and writes
 * it to /data/cs2.json and /data/valorant.json as plain static files.
 *
 * IMPORTANT: this script only ever runs server-side (locally, or via the
 * GitHub Action in .github/workflows/update-data.yml). It is never shipped
 * to the browser, so the API token never reaches anyone's network tab.
 *
 * Endpoints used are confirmed available on PandaScore's FREE plan:
 *   /csgo/matches/running|upcoming   (CS2, via ?filter[videogame_title]=cs-2)
 *   /valorant/matches/running|upcoming
 *   /csgo/tournaments/running, /valorant/tournaments/running
 *   /tournaments/{id}/standings
 *
 * NOT included: per-player performance stats (rating/ADR/ACS/K-D). Those
 * endpoints require PandaScore's paid Historical plan. The website keeps
 * the Player Leaderboard panel on sample data until that's upgraded.
 */

const TOKEN = process.env.PANDASCORE_TOKEN;
if (!TOKEN) {
  console.error("Missing PANDASCORE_TOKEN environment variable. Set it as a GitHub Actions secret (see README.md).");
  process.exit(1);
}

const BASE = "https://api.pandascore.co";
const fs = require("fs");
const path = require("path");

async function get(pathname, searchParams = {}) {
  const url = new URL(BASE + pathname);
  for (const [k, v] of Object.entries(searchParams)) url.searchParams.set(k, v);
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/json" }
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GET ${pathname} -> ${res.status} ${res.statusText}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

function badge(name) {
  return (name || "?").split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
}

// Turn a raw PandaScore match object into the shape the website expects.
function simplifyMatch(m) {
  const opponents = (m.opponents || [])
    .filter(o => o.type === "Team")
    .map(o => o.opponent);
  const [a, b] = opponents;
  const scoreOf = (teamId) => {
    const r = (m.results || []).find(r => r.team_id === teamId);
    return r ? r.score : 0;
  };
  return {
    id: m.id,
    status: m.status, // not_started | running | finished | postponed | canceled
    scheduledAt: m.scheduled_at,
    league: m.league?.name || "",
    serie: m.serie?.full_name || m.serie?.name || "",
    tournament: m.tournament?.name || "",
    bestOf: m.number_of_games || null,
    teamA: a ? { name: a.name, acronym: a.acronym || badge(a.name) } : { name: "TBD", acronym: "TBD" },
    teamB: b ? { name: b.name, acronym: b.acronym || badge(b.name) } : { name: "TBD", acronym: "TBD" },
    scoreA: a ? scoreOf(a.id) : 0,
    scoreB: b ? scoreOf(b.id) : 0
  };
}

function simplifyStandingRow(row, i) {
  const base = { rank: row.rank ?? i + 1, team: row.team?.name || "Unknown", acronym: row.team?.acronym || badge(row.team?.name) };
  if (typeof row.wins === "number") {
    // GroupStanding shape
    return {
      ...base,
      w: row.wins,
      l: row.losses,
      rd: (row.game_wins ?? 0) - (row.game_losses ?? 0)
    };
  }
  // BracketStanding shape (no W/L, just rank + last match)
  return { ...base, w: null, l: null, rd: null };
}

// Picks the most relevant currently-running tournament to show standings for.
// Prefers higher-tier events (S > A > B > C > D) when several are running.
function pickTournament(tournaments) {
  const tierOrder = { s: 0, a: 1, b: 2, c: 3, d: 4, unranked: 5 };
  return [...tournaments].sort((x, y) => (tierOrder[x.tier] ?? 9) - (tierOrder[y.tier] ?? 9))[0];
}

async function buildGame({ key, prefix, extraFilter }) {
  const filterQS = extraFilter || {};

  const [running, upcoming, runningTournaments] = await Promise.all([
    get(`/${prefix}/matches/running`, { per_page: 6, ...filterQS }),
    get(`/${prefix}/matches/upcoming`, { per_page: 6, sort: "scheduled_at", ...filterQS }),
    get(`/${prefix}/tournaments/running`, { per_page: 10, ...filterQS })
  ]);

  let standings = [];
  let standingsContext = null;
  const chosen = runningTournaments.length ? pickTournament(runningTournaments) : null;
  if (chosen) {
    try {
      const raw = await get(`/tournaments/${chosen.id}/standings`, { per_page: 20 });
      standings = raw.map(simplifyStandingRow);
      standingsContext = chosen.name;
    } catch (e) {
      console.warn(`[${key}] could not fetch standings for tournament ${chosen.id}: ${e.message}`);
    }
  }

  // Build a small team directory straight from match opponents — no extra
  // API calls needed, and it's automatically the teams currently in action.
  const teamMap = new Map();
  for (const m of [...running, ...upcoming]) {
    for (const o of m.opponents || []) {
      if (o.type === "Team" && o.opponent?.id && !teamMap.has(o.opponent.id)) {
        teamMap.set(o.opponent.id, {
          name: o.opponent.name,
          acronym: o.opponent.acronym || badge(o.opponent.name),
          region: o.opponent.location || "—"
        });
      }
    }
  }

  return {
    matches: {
      running: running.map(simplifyMatch),
      upcoming: upcoming.map(simplifyMatch)
    },
    standings,
    standingsContext,
    teams: Array.from(teamMap.values()).slice(0, 8),
    // Real per-player stats need PandaScore's paid Historical plan.
    playersAvailable: false,
    generatedAt: new Date().toISOString()
  };
}

async function main() {
  const outDir = path.join(__dirname, "..", "data");
  fs.mkdirSync(outDir, { recursive: true });

  const jobs = [
    { key: "cs2", prefix: "csgo", extraFilter: { "filter[videogame_title]": "cs-2" }, outFile: "cs2.json" },
    { key: "valorant", prefix: "valorant", extraFilter: {}, outFile: "valorant.json" }
  ];

  for (const job of jobs) {
    try {
      const data = await buildGame(job);
      fs.writeFileSync(path.join(outDir, job.outFile), JSON.stringify(data, null, 2));
      console.log(`Wrote data/${job.outFile} (${data.matches.running.length} running, ${data.matches.upcoming.length} upcoming, ${data.standings.length} standings rows, ${data.teams.length} teams)`);
    } catch (e) {
      console.error(`Failed to build data for ${job.key}: ${e.message}`);
      process.exitCode = 1;
    }
  }
}

main();
