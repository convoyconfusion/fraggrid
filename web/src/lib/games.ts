export type GameSlug = "cs2" | "valorant" | "bgmi" | "pubgm";

export interface GameMeta {
  slug: GameSlug;
  name: string;
  shortName: string;
  accent: string; // CSS var reference
  platform: "PC" | "Mobile";
  /** Whether standings/matches are synced automatically from PandaScore, or entered manually by staff. */
  dataSource: "pandascore" | "manual";
  /** Column headers for the 3 numeric standings columns — win/loss for tactical shooters, wins/matches/points for battle royale. */
  standingsColumns: [string, string, string];
}

export const GAMES: Record<GameSlug, GameMeta> = {
  cs2: {
    slug: "cs2",
    name: "Counter-Strike 2",
    shortName: "CS2",
    accent: "var(--accent-cs2)",
    platform: "PC",
    dataSource: "pandascore",
    standingsColumns: ["W", "L", "RD"],
  },
  valorant: {
    slug: "valorant",
    name: "Valorant",
    shortName: "Valorant",
    accent: "var(--accent-valorant)",
    platform: "PC",
    dataSource: "pandascore",
    standingsColumns: ["W", "L", "RD"],
  },
  bgmi: {
    slug: "bgmi",
    name: "Battlegrounds Mobile India",
    shortName: "BGMI",
    accent: "var(--accent-bgmi)",
    platform: "Mobile",
    dataSource: "manual",
    standingsColumns: ["Wins", "Matches", "Points"],
  },
  pubgm: {
    slug: "pubgm",
    name: "PUBG Mobile",
    shortName: "PUBGM",
    accent: "var(--accent-pubgm)",
    platform: "Mobile",
    dataSource: "manual",
    standingsColumns: ["Wins", "Matches", "Points"],
  },
};

export const GAME_ORDER: GameSlug[] = ["cs2", "valorant", "bgmi", "pubgm"];

export function isGameSlug(value: string): value is GameSlug {
  return value in GAMES;
}
