"use client";

import { useEffect, useRef, useState } from "react";

const BLOBS = [
  { color: "rgba(123,94,167,0.55)", lag: 0.08, size: 420, staticTop: "10%", staticLeft: "15%" },
  { color: "rgba(31,214,193,0.35)", lag: 0.045, size: 360, staticTop: "40%", staticLeft: "60%" },
];

export function CursorGlow() {
  const [interactive, setInteractive] = useState(false);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover), (pointer: fine)").matches;
    setInteractive(canHover);
    if (!canHover) return;

    let mouseX = window.innerWidth * 0.4;
    let mouseY = window.innerHeight * 0.3;
    const pos = BLOBS.map(() => ({ x: mouseX, y: mouseY }));
    let frame: number;

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      BLOBS.forEach((blob, i) => {
        pos[i].x += (mouseX - pos[i].x) * blob.lag;
        pos[i].y += (mouseY - pos[i].y) * blob.lag;
        const el = refs.current[i];
        if (el) {
          el.style.transform = `translate(${pos[i].x - blob.size / 2}px, ${pos[i].y - blob.size / 2}px)`;
        }
      });
      frame = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMove);
    frame = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`blur-shape ${interactive ? "blur-shape-follow" : "blur-shape-static"}`}
          style={{
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color}, transparent 70%)`,
            ...(interactive ? {} : { top: blob.staticTop, left: blob.staticLeft }),
          }}
        />
      ))}
    </div>
  );
}
