"use client";

import { useEffect, useLayoutEffect, useState } from "react";

// Avoids React's useLayoutEffect-on-server warning while still applying the
// initial state before paint in the browser (no expanded-header flash on reload).
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** True once `window.scrollY` passes `threshold`. Updates only on crossings. */
export function useScrollThreshold(threshold: number): boolean {
  const [passed, setPassed] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const sync = () => {
      const next = window.scrollY > threshold;
      setPassed((previous) => (previous === next ? previous : next));
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });

    return () => window.removeEventListener("scroll", sync);
  }, [threshold]);

  return passed;
}
