"use client";

import { ArrowUp } from "lucide-react";
import { useScrollThreshold } from "@/hooks/use-scroll-threshold";
import { cn } from "@/lib/utils";

const VISIBLE_AFTER = 600;

export function ScrollToTop() {
  const visible = useScrollThreshold(VISIBLE_AFTER);

  function scrollToTop() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // `globals.css` enables smooth scrolling only for reduced-motion: no-preference,
    // but an explicit `behavior: smooth` here would override that preference.
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "border-border bg-card/90 text-foreground hover:border-primary/40 hover:text-primary focus-visible:ring-ring fixed right-4 bottom-4 z-40 grid size-11 place-items-center rounded-full border shadow-sm backdrop-blur transition-[opacity,transform,color,border-color] duration-300 focus-visible:ring-2 focus-visible:outline-none sm:right-6 sm:bottom-6 motion-reduce:transition-none",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <ArrowUp className="size-4" aria-hidden="true" />
    </button>
  );
}
