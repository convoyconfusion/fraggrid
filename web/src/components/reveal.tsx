"use client";

import { useReveal } from "@/hooks/use-reveal";

export function Reveal({
  children,
  className,
  threshold,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  as?: "div" | "section";
}) {
  const ref = useReveal<HTMLElement>(threshold);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={className ? `reveal ${className}` : "reveal"}
    >
      {children}
    </Tag>
  );
}
