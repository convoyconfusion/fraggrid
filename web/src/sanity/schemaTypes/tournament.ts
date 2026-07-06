import { defineField, defineType } from "sanity";

export const playerStatEntry = defineType({
  name: "playerStatEntry",
  title: "Player stat row",
  type: "object",
  fields: [
    defineField({
      name: "player",
      title: "Player",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "team", title: "Team", type: "string" }),
    defineField({ name: "kills", title: "Kills", type: "number" }),
    defineField({ name: "deaths", title: "Deaths", type: "number" }),
    defineField({ name: "assists", title: "Assists", type: "number" }),
    defineField({ name: "kd", title: "K/D", type: "number" }),
    defineField({ name: "mvps", title: "MVPs", type: "number" }),
    defineField({
      name: "extraStats",
      title: "Game-specific stats",
      description: "e.g. ACS, ADR, Rating 2.0, Survival Points — whatever fits this game",
      type: "array",
      of: [
        {
          type: "object",
          name: "statPair",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
          ],
          preview: {
            select: { label: "label", value: "value" },
            prepare: ({ label, value }: { label?: string; value?: string }) => ({
              title: `${label ?? "?"}: ${value ?? "?"}`,
            }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: { player: "player", team: "team", kills: "kills" },
    prepare: ({ player, team, kills }: { player?: string; team?: string; kills?: number }) => ({
      title: `${player ?? "?"} (${team ?? "—"})`,
      subtitle: `${kills ?? 0} kills`,
    }),
  },
});

export const tournament = defineType({
  name: "tournament",
  title: "Tournament",
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
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "prizePool",
      title: "Prize pool",
      description: 'e.g. "$2,500" — auto-filled for CS2/Valorant when PandaScore has it, editable',
      type: "string",
    }),
    defineField({ name: "startDate", title: "Start date", type: "datetime" }),
    defineField({ name: "endDate", title: "End date", type: "datetime" }),
    defineField({
      name: "externalId",
      title: "PandaScore tournament ID",
      description: "Set automatically for synced tournaments — do not edit",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "playerStats",
      title: "Player stats",
      description: "Entered manually — PandaScore's current plan doesn't expose per-player match stats",
      type: "array",
      of: [{ type: "playerStatEntry" }],
    }),
  ],
  preview: {
    select: { title: "name", game: "game", prize: "prizePool" },
    prepare: ({ title, game, prize }: { title?: string; game?: string; prize?: string }) => ({
      title,
      subtitle: `${game ?? ""}${prize ? ` · ${prize}` : ""}`,
    }),
  },
});
