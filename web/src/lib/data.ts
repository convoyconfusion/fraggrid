import type { GameSlug } from "./games";
import { GAME_ORDER } from "./games";
import type { Article, GameData, Match, StandingRow, Tournament } from "./types";
import { client } from "@/sanity/client";

const GAME_DATA_QUERY = /* groq */ `*[_type == "gameData" && game == $game][0]{
  game,
  standingsContext,
  matchesRunning,
  matchesUpcoming,
  standings,
  teams,
  generatedAt
}`;

const ARTICLES_QUERY = /* groq */ `*[_type == "article"] | order(publishedAt desc){
  "slug": slug.current,
  title,
  dek,
  body,
  game,
  "author": author->name,
  publishedAt
}`;

const ARTICLE_BY_SLUG_QUERY = /* groq */ `*[_type == "article" && slug.current == $slug][0]{
  "slug": slug.current,
  title,
  dek,
  body,
  game,
  "author": author->name,
  publishedAt
}`;

const TOURNAMENTS_QUERY = /* groq */ `*[_type == "tournament" && game == $game] | order(startDate desc){
  "slug": slug.current,
  game,
  name,
  prizePool,
  startDate,
  endDate,
  playerStats
}`;

const TOURNAMENT_BY_SLUG_QUERY = /* groq */ `*[_type == "tournament" && game == $game && slug.current == $slug][0]{
  "slug": slug.current,
  game,
  name,
  prizePool,
  startDate,
  endDate,
  playerStats
}`;

function emptyGameData(game: GameSlug): GameData {
  return {
    game,
    matches: { running: [], upcoming: [] },
    standings: [],
    standingsContext: null,
    teams: [],
    playersAvailable: false,
    generatedAt: null,
  };
}

interface RawMatchEntry {
  externalId?: string;
  _key: string;
  status: Match["status"];
  scheduledAt: string | null;
  league: string;
  serie: string;
  tournament: string;
  bestOf: number | null;
  teamAName: string;
  teamAAcronym: string;
  teamBName: string;
  teamBAcronym: string;
  scoreA: number;
  scoreB: number;
}

function toMatch(raw: RawMatchEntry): Match {
  return {
    id: raw.externalId || raw._key,
    status: raw.status,
    scheduledAt: raw.scheduledAt,
    league: raw.league,
    serie: raw.serie,
    tournament: raw.tournament,
    bestOf: raw.bestOf,
    teamA: { name: raw.teamAName, acronym: raw.teamAAcronym },
    teamB: { name: raw.teamBName, acronym: raw.teamBAcronym },
    scoreA: raw.scoreA ?? 0,
    scoreB: raw.scoreB ?? 0,
  };
}

interface RawGameData {
  game: GameSlug;
  standingsContext: string | null;
  matchesRunning: RawMatchEntry[] | null;
  matchesUpcoming: RawMatchEntry[] | null;
  standings: StandingRow[] | null;
  teams: GameData["teams"] | null;
  generatedAt: string | null;
}

export async function getGameData(slug: GameSlug): Promise<GameData> {
  const raw = await client.fetch<RawGameData | null>(GAME_DATA_QUERY, { game: slug });
  if (!raw) return emptyGameData(slug);

  return {
    game: raw.game,
    matches: {
      running: (raw.matchesRunning ?? []).map(toMatch),
      upcoming: (raw.matchesUpcoming ?? []).map(toMatch),
    },
    standings: raw.standings ?? [],
    standingsContext: raw.standingsContext ?? null,
    teams: raw.teams ?? [],
    playersAvailable: false,
    generatedAt: raw.generatedAt ?? null,
  };
}

export async function getAllGameData(): Promise<Record<GameSlug, GameData>> {
  const entries = await Promise.all(GAME_ORDER.map(async (slug) => [slug, await getGameData(slug)] as const));
  return Object.fromEntries(entries) as Record<GameSlug, GameData>;
}

export async function getArticles(filterGame?: GameSlug | "editorial"): Promise<Article[]> {
  const articles = await client.fetch<Article[]>(ARTICLES_QUERY);
  if (!filterGame) return articles;
  return articles.filter((a) => a.game === filterGame);
}

export async function getArticle(slug: string): Promise<Article | null> {
  return client.fetch<Article | null>(ARTICLE_BY_SLUG_QUERY, { slug });
}

export async function getLatestArticles(count: number): Promise<Article[]> {
  return (await getArticles()).slice(0, count);
}

function normalizeTournament(raw: Tournament): Tournament {
  return { ...raw, playerStats: raw.playerStats ?? [] };
}

export async function getTournaments(game: GameSlug): Promise<Tournament[]> {
  const rows = await client.fetch<Tournament[]>(TOURNAMENTS_QUERY, { game });
  return (rows ?? []).map(normalizeTournament);
}

export async function getTournament(game: GameSlug, slug: string): Promise<Tournament | null> {
  const row = await client.fetch<Tournament | null>(TOURNAMENT_BY_SLUG_QUERY, { game, slug });
  return row ? normalizeTournament(row) : null;
}
