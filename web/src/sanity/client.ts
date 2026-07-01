import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "./env";

// Public, read-only client — used by pages to render match/article data.
// Safe to run on the server; the dataset is public so no token is needed to read.
// useCdn is off because this is a live-stats site — the CDN's edge cache can
// lag ~30-60s behind writes, which would hide just-synced scores/standings.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

// Server-only write client — used exclusively by the PandaScore sync route.
// SANITY_API_TOKEN must never be exposed to the browser.
export function getWriteClient() {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    throw new Error("Missing SANITY_API_TOKEN — required to write data to Sanity.");
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}
