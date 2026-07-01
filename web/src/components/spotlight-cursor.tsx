"use client";

import { useEffect, useRef } from "react";

export function SpotlightCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    document.body.classList.add("custom-cursor");

    const handleMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursor.style.opacity = "1";
    };

    const handleOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button")) {
        cursor.style.transform = "translate(-50%, -50%) scale(2)";
      }
    };

    const handleOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button")) {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
      }
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      document.body.classList.remove("custom-cursor");
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, []);

  return <div ref={cursorRef} className="cursor" />;
}
