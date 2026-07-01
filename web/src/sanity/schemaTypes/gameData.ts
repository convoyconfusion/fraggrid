import { defineField, defineType } from "sanity";

export const gameData = defineType({
  name: "gameData",
  title: "Game data",
  type: "document",
  fields: [
    defineField({
      name: "game",
      title: "Game",
      type: "string",
      options: { list: ["cs2", "valorant", "bgmi", "pubgm"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "standingsContext",
      title: "Standings context",
      description: 'e.g. "IEM Katowice — Group Stage"',
      type: "string",
    }),
    defineField({
      name: "matchesRunning",
      title: "Live matches",
      type: "array",
      of: [{ type: "matchEntry" }],
    }),
    defineField({
      name: "matchesUpcoming",
      title: "Upcoming matches",
      type: "array",
      of: [{ type: "matchEntry" }],
    }),
    defineField({
      name: "standings",
      title: "Standings",
      type: "array",
      of: [{ type: "standingRow" }],
    }),
    defineField({
      name: "teams",
      title: "Teams",
      type: "array",
      of: [{ type: "teamEntry" }],
    }),
    defineField({
      name: "generatedAt",
      title: "Last synced at",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "game" },
    prepare: ({ title }) => ({ title: `Game data — ${title}` }),
  },
});
