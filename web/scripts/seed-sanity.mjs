// One-off seed script — pushes the local seed JSON (src/data/seed/*.json) into
// Sanity so the site has real content to render against during development.
// Run with: node --env-file=.env.local scripts/seed-sanity.mjs (from web/)

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2026-01-01",
  useCdn: false,
});

function readSeed(name) {
  return JSON.parse(readFileSync(path.join(__dirname, "..", "src", "data", "seed", `${name}.json`), "utf-8"));
}

function toMatchEntry(m) {
  return {
    _key: String(m.id),
    externalId: String(m.id),
    status: m.status,
    scheduledAt: m.scheduledAt,
    league: m.league,
    serie: m.serie,
    tournament: m.tournament,
    bestOf: m.bestOf,
    teamAName: m.teamA.name,
    teamAAcronym: m.teamA.acronym,
    teamBName: m.teamB.name,
    teamBAcronym: m.teamB.acronym,
    scoreA: m.scoreA,
    scoreB: m.scoreB,
  };
}

function toStandingRow(row) {
  return { _key: `rank-${row.rank}`, rank: row.rank, team: row.team, acronym: row.acronym, w: row.w, l: row.l, rd: row.rd };
}

function toTeamEntry(t) {
  return { _key: t.acronym, name: t.name, acronym: t.acronym, region: t.region };
}

async function seedGame(slug) {
  const data = readSeed(slug);
  await client.createOrReplace({
    _id: `gameData-${slug}`,
    _type: "gameData",
    game: slug,
    standingsContext: data.standingsContext,
    matchesRunning: data.matches.running.map(toMatchEntry),
    matchesUpcoming: data.matches.upcoming.map(toMatchEntry),
    standings: data.standings.map(toStandingRow),
    teams: data.teams.map(toTeamEntry),
    generatedAt: new Date().toISOString(),
  });
  console.log(`Seeded gameData-${slug}`);
}

async function seedAuthors() {
  const authors = ["Priya N.", "Arjun K.", "The FRAGGRID Team"];
  const ids = {};
  for (const name of authors) {
    const id = `author-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    await client.createOrReplace({ _id: id, _type: "author", name });
    ids[name] = id;
  }
  console.log("Seeded authors");
  return ids;
}

async function seedArticles(authorIds) {
  const articles = readSeed("articles");
  for (const a of articles) {
    await client.createOrReplace({
      _id: `article-${a.slug}`,
      _type: "article",
      title: a.title,
      slug: { _type: "slug", current: a.slug },
      dek: a.dek,
      game: a.game,
      author: { _type: "reference", _ref: authorIds[a.author] },
      body: a.body.map((paragraph) => ({
        _type: "block",
        _key: Math.random().toString(36).slice(2),
        style: "normal",
        children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text: paragraph }],
      })),
      publishedAt: a.publishedAt,
    });
    console.log(`Seeded article-${a.slug}`);
  }
}

async function main() {
  for (const slug of ["cs2", "valorant", "bgmi", "pubgm"]) {
    await seedGame(slug);
  }
  const authorIds = await seedAuthors();
  await seedArticles(authorIds);
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
