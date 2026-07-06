import type { GameSlug } from "./games";

export type MatchStatus =
  | "not_started"
  | "running"
  | "finished"
  | "postponed"
  | "canceled";

export interface MatchTeam {
  name: string;
  acronym: string;
}

export interface Match {
  id: string | number;
  status: MatchStatus;
  scheduledAt: string | null;
  league: string;
  serie: string;
  tournament: string;
  bestOf: number | null;
  teamA: MatchTeam;
  teamB: MatchTeam;
  scoreA: number;
  scoreB: number;
}

export interface StandingRow {
  rank: number;
  team: string;
  acronym: string;
  w: number | null;
  l: number | null;
  rd: number | null;
}

export interface TeamDirectoryEntry {
  name: string;
  acronym: string;
  region: string;
}

export interface GameData {
  game: GameSlug;
  matches: {
    running: Match[];
    upcoming: Match[];
  };
  standings: StandingRow[];
  standingsContext: string | null;
  teams: TeamDirectoryEntry[];
  playersAvailable: boolean;
  generatedAt: string | null;
}

export interface StatPair {
  label: string;
  value: string;
}

export interface PlayerStatRow {
  player: string;
  team: string | null;
  kills: number | null;
  deaths: number | null;
  assists: number | null;
  kd: number | null;
  mvps: number | null;
  extraStats: StatPair[];
}

export interface Tournament {
  slug: string;
  game: GameSlug;
  name: string;
  prizePool: string | null;
  startDate: string | null;
  endDate: string | null;
  playerStats: PlayerStatRow[];
}

export interface Article {
  slug: string;
  title: string;
  dek: string;
  body: unknown[]; // Portable Text blocks from Sanity
  game: GameSlug | "editorial";
  author: string;
  publishedAt: string;
}
