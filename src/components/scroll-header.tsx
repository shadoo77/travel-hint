"use client";

import type { ReactNode } from "react";
import { useScrollThreshold } from "@/hooks/use-scroll-threshold";

const SCROLL_THRESHOLD = 16;

/**
 * Sticky shell. It only flips a `data-scrolled` flag; the visual shrink lives in
 * `group-data-[scrolled=true]:*` classes on the header contents, so this stays a
 * server component where it matters and the transition is pure CSS.
 */
export function ScrollHeader({ children }: { children: ReactNode }) {
  const scrolled = useScrollThreshold(SCROLL_THRESHOLD);

  return (
    <header
      data-scrolled={scrolled ? "true" : "false"}
      className="group border-border/60 bg-background/80 data-[scrolled=true]:bg-background/95 sticky top-0 z-50 border-b backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 data-[scrolled=true]:shadow-sm data-[scrolled=true]:backdrop-blur-xl motion-reduce:transition-none"
    >
      {children}
    </header>
  );
}
