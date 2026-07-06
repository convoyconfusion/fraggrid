import { NextResponse } from "next/server";
import { getWriteClient } from "@/sanity/client";

/**
 * Pulls live CS2 + Valorant match/standings/team data from PandaScore and
 * upserts it into Sanity as `gameData` documents (_id: gameData-cs2 /
 * gameData-valorant). Ported from the original scripts/fetch-data.js, which
 * wrote the same shape to static JSON files.
 *
 * BGMI and PUBGM are intentionally excluded — PandaScore doesn't cover those
 * titles, so their gameData documents are edited by staff directly in
 * Sanity Studio instead.
 *
 * Triggered on a schedule by Vercel Cron (see vercel.json), which sends
 * `Authorization: Bearer $CRON_SECRET` — checked below to stop anyone else
 * from hitting this URL and burning PandaScore's rate limit.
 */

export const dynamic = "force-dynamic";

const PANDASCORE_BASE = "https://api.pandascore.co";

interface PandaScoreOpponent {
  type: string;
  opponent?: { id: number; name: string; acronym?: string; location?: string };
}

interface PandaScoreMatch {
  id: number;
  status: string;
  scheduled_at: string | null;
  league?: { name: string };
  serie?: { full_name?: string; name?: string };
  tournament?: { name: string };
  number_of_games?: number;
  opponents?: PandaScoreOpponent[];
  results?: { team_id: number; score: number }[];
}

interface PandaScoreTournament {
  id: number;
  name: string;
  tier?: string;
  prizepool?: string | null;
  begin_at?: string | null;
  end_at?: string | null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function badge(name: string | undefined) {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

async function getPandaScore<T>(token: string, pathname: string, searchParams: Record<string, string> = {}): Promise<T> {
  const url = new URL(PANDASCORE_BASE + pathname);
  for (const [k, v] of Object.entries(searchParams)) url.searchParams.set(k, v);
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GET ${pathname} -> ${res.status} ${res.statusText}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

function simplifyMatch(m: PandaScoreMatch) {
  const opponents = (m.opponents || []).filter((o) => o.type === "Team").map((o) => o.opponent);
  const [a, b] = opponents;
  const scoreOf = (teamId?: number) => (m.results || []).find((r) => r.team_id === teamId)?.score ?? 0;

  return {
    _key: String(m.id),
    externalId: String(m.id),
    status: m.status,
    scheduledAt: m.scheduled_at,
    league: m.league?.name || "",
    serie: m.serie?.full_name || m.serie?.name || "",
    tournament: m.tournament?.name || "",
    bestOf: m.number_of_games ?? null,
    teamAName: a?.name ?? "TBD",
    teamAAcronym: a?.acronym || badge(a?.name) || "TBD",
    teamBName: b?.name ?? "TBD",
    teamBAcronym: b?.acronym || badge(b?.name) || "TBD",
    scoreA: a ? scoreOf(a.id) : 0,
    scoreB: b ? scoreOf(b.id) : 0,
  };
}

function simplifyStandingRow(row: { rank?: number; wins?: number; losses?: number; game_wins?: number; game_losses?: number; team?: { name: string; acronym?: string } }, i: number) {
  const base = {
    _key: `rank-${row.rank ?? i + 1}`,
    rank: row.rank ?? i + 1,
    team: row.team?.name || "Unknown",
    acronym: row.team?.acronym || badge(row.team?.name),
  };
  if (typeof row.wins === "number") {
    return { ...base, w: row.wins, l: row.losses ?? 0, rd: (row.game_wins ?? 0) - (row.game_losses ?? 0) };
  }
  return { ...base, w: null, l: null, rd: null };
}

function pickTournament(tournaments: PandaScoreTournament[]) {
  const tierOrder: Record<string, number> = { s: 0, a: 1, b: 2, c: 3, d: 4, unranked: 5 };
  return [...tournaments].sort((x, y) => (tierOrder[x.tier ?? "unranked"] ?? 9) - (tierOrder[y.tier ?? "unranked"] ?? 9))[0];
}

async function buildGame(token: string, prefix: string, extraFilter: Record<string, string>) {
  const [running, upcoming, runningTournaments] = await Promise.all([
    getPandaScore<PandaScoreMatch[]>(token, `/${prefix}/matches/running`, { per_page: "6", ...extraFilter }),
    getPandaScore<PandaScoreMatch[]>(token, `/${prefix}/matches/upcoming`, { per_page: "6", sort: "scheduled_at", ...extraFilter }),
    getPandaScore<PandaScoreTournament[]>(token, `/${prefix}/tournaments/running`, { per_page: "10", ...extraFilter }),
  ]);

  let standings: ReturnType<typeof simplifyStandingRow>[] = [];
  let standingsContext: string | null = null;
  const chosen = runningTournaments.length ? pickTournament(runningTournaments) : null;
  if (chosen) {
    try {
      const raw = await getPandaScore<Parameters<typeof simplifyStandingRow>[0][]>(
        token,
        `/tournaments/${chosen.id}/standings`,
        { per_page: "20" }
      );
      standings = raw.map(simplifyStandingRow);
      standingsContext = chosen.name;
    } catch (e) {
      console.warn(`could not fetch standings for tournament ${chosen.id}: ${(e as Error).message}`);
    }
  }

  const teamMap = new Map<number, { _key: string; name: string; acronym: string; region: string }>();
  for (const m of [...running, ...upcoming]) {
    for (const o of m.opponents || []) {
      if (o.type === "Team" && o.opponent?.id && !teamMap.has(o.opponent.id)) {
        teamMap.set(o.opponent.id, {
          _key: String(o.opponent.id),
          name: o.opponent.name,
          acronym: o.opponent.acronym || badge(o.opponent.name),
          region: o.opponent.location || "—",
        });
      }
    }
  }

  return {
    matchesRunning: running.map(simplifyMatch),
    matchesUpcoming: upcoming.map(simplifyMatch),
    standings,
    standingsContext,
    teams: Array.from(teamMap.values()).slice(0, 8),
    generatedAt: new Date().toISOString(),
    chosenTournament: chosen,
  };
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const token = process.env.PANDASCORE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Missing PANDASCORE_TOKEN" }, { status: 500 });
  }

  const jobs = [
    { game: "cs2", prefix: "csgo", extraFilter: { "filter[videogame_title]": "cs-2" } },
    { game: "valorant", prefix: "valorant", extraFilter: {} },
  ] as const;

  const writeClient = getWriteClient();
  const results: Record<string, string> = {};

  for (const job of jobs) {
    try {
      const { chosenTournament, ...data } = await buildGame(
        token,
        job.prefix,
        job.extraFilter as Record<string, string>
      );
      await writeClient.createOrReplace({
        _id: `gameData-${job.game}`,
        _type: "gameData",
        game: job.game,
        ...data,
      });

      if (chosenTournament) {
        const tournamentId = `tournament-${job.game}-${chosenTournament.id}`;
        await writeClient.createIfNotExists({
          _id: tournamentId,
          _type: "tournament",
          game: job.game,
          name: chosenTournament.name,
          slug: { _type: "slug", current: slugify(chosenTournament.name) },
          externalId: String(chosenTournament.id),
          playerStats: [],
        });
        // Patch only the PandaScore-sourced fields so staff-entered playerStats survive re-syncs.
        await writeClient
          .patch(tournamentId)
          .set({
            name: chosenTournament.name,
            prizePool: chosenTournament.prizepool ?? null,
            startDate: chosenTournament.begin_at ?? null,
            endDate: chosenTournament.end_at ?? null,
          })
          .commit();
      }

      results[job.game] = `ok (${data.matchesRunning.length} running, ${data.matchesUpcoming.length} upcoming, ${data.standings.length} standings)`;
    } catch (e) {
      results[job.game] = `failed: ${(e as Error).message}`;
    }
  }

  return NextResponse.json({ results });
}
