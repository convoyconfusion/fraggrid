import { defineField, defineType } from "sanity";

export const matchObject = defineType({
  name: "matchEntry",
  title: "Match",
  type: "object",
  fields: [
    defineField({ name: "externalId", title: "External ID", type: "string" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["not_started", "running", "finished", "postponed", "canceled"],
      },
      initialValue: "not_started",
    }),
    defineField({ name: "scheduledAt", title: "Scheduled at", type: "datetime" }),
    defineField({ name: "league", title: "League", type: "string" }),
    defineField({ name: "serie", title: "Serie", type: "string" }),
    defineField({ name: "tournament", title: "Tournament", type: "string" }),
    defineField({ name: "bestOf", title: "Best of", type: "number" }),
    defineField({ name: "teamAName", title: "Team A name", type: "string" }),
    defineField({ name: "teamAAcronym", title: "Team A acronym", type: "string" }),
    defineField({ name: "teamBName", title: "Team B name", type: "string" }),
    defineField({ name: "teamBAcronym", title: "Team B acronym", type: "string" }),
    defineField({ name: "scoreA", title: "Score A", type: "number", initialValue: 0 }),
    defineField({ name: "scoreB", title: "Score B", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { a: "teamAAcronym", b: "teamBAcronym", scoreA: "scoreA", scoreB: "scoreB" },
    prepare: ({ a, b, scoreA, scoreB }) => ({
      title: `${a ?? "TBD"} ${scoreA ?? 0} – ${scoreB ?? 0} ${b ?? "TBD"}`,
    }),
  },
});

export const standingRowObject = defineType({
  name: "standingRow",
  title: "Standing row",
  type: "object",
  fields: [
    defineField({ name: "rank", title: "Rank", type: "number" }),
    defineField({ name: "team", title: "Team name", type: "string" }),
    defineField({ name: "acronym", title: "Acronym", type: "string" }),
    defineField({ name: "w", title: "Wins", type: "number" }),
    defineField({ name: "l", title: "Losses / matches", type: "number" }),
    defineField({ name: "rd", title: "Round diff / points", type: "number" }),
  ],
  preview: {
    select: { rank: "rank", team: "team" },
    prepare: ({ rank, team }) => ({ title: `#${rank} ${team}` }),
  },
});

export const teamEntryObject = defineType({
  name: "teamEntry",
  title: "Team",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "acronym", title: "Acronym", type: "string" }),
    defineField({ name: "region", title: "Region", type: "string" }),
  ],
});
