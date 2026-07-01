import Link from "next/link";
import { GAME_ORDER, GAMES } from "@/lib/games";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:justify-between">
        <div>
          <p className="text-lg font-bold tracking-tight">
            <span className="text-text">FRAG</span>
            <span className="text-accent-cs2">GRID</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-text-muted">
            Live stats, standings and news for CS2, Valorant, BGMI and PUBG Mobile.
          </p>
        </div>

        <div className="flex gap-10 text-sm">
          <div>
            <p className="font-semibold text-text">Games</p>
            <ul className="mt-2 space-y-1">
              {GAME_ORDER.map((slug) => (
                <li key={slug}>
                  <Link href={`/${slug}`} className="text-text-muted hover:text-text">
                    {GAMES[slug].shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-text">Site</p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/news" className="text-text-muted hover:text-text">
                  News
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="border-t border-border px-4 py-4 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} FRAGGRID
      </p>
    </footer>
  );
}
