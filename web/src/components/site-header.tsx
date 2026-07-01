"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GAME_ORDER, GAMES } from "@/lib/games";

const menuContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const menuItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="text-text">FRAG</span>
          <span className="text-accent-cs2">GRID</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {GAME_ORDER.map((slug) => {
            const game = GAMES[slug];
            return (
              <Link
                key={slug}
                href={`/${slug}`}
                className="group flex items-center gap-2 text-sm font-medium text-text-muted transition hover:text-text"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: game.accent }}
                />
                {game.shortName}
              </Link>
            );
          })}
          <Link
            href="/news"
            className="text-sm font-medium text-text-muted transition hover:text-text"
          >
            News
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-9 w-9 items-center justify-center rounded border border-border text-text md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="sr-only">Toggle menu</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 flex flex-col bg-bg md:hidden"
          >
            <motion.ul
              variants={menuContainer}
              initial="hidden"
              animate="show"
              className="flex flex-1 flex-col items-center justify-center gap-8"
            >
              {GAME_ORDER.map((slug) => {
                const game = GAMES[slug];
                return (
                  <motion.li key={slug} variants={menuItem}>
                    <Link
                      href={`/${slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 text-2xl font-semibold text-text"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: game.accent }}
                      />
                      {game.shortName}
                    </Link>
                  </motion.li>
                );
              })}
              <motion.li variants={menuItem}>
                <Link
                  href="/news"
                  onClick={() => setOpen(false)}
                  className="text-2xl font-semibold text-text"
                >
                  News
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
