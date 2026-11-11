import Link from "next/link";
import { TreePalm } from "lucide-react";

export function SiteHeader() {
  return (
    <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-5 transition-[height] duration-300 ease-out group-data-[scrolled=true]:h-16 sm:h-24 sm:px-8 sm:group-data-[scrolled=true]:h-16 lg:h-28 lg:group-data-[scrolled=true]:h-16 motion-reduce:transition-none">
      <Link href="/" className="group/logo flex items-baseline gap-2.5">
        <span className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-full transition-[width,height] duration-300 group-data-[scrolled=true]:size-8 motion-reduce:transition-none">
          {/* `transition-transform` (not `transition-[transform]`) so Tailwind v4's `rotate` property is animated too. */}
          <span className="transition-transform duration-500 group-hover/logo:-rotate-12 motion-reduce:transition-none">
            <TreePalm className="size-4" aria-hidden="true" />
          </span>
        </span>
        <span className="font-heading text-2xl leading-none tracking-tight transition-[font-size] duration-300 group-data-[scrolled=true]:text-lg motion-reduce:transition-none">
          Trav<span className="text-primary">.</span>Hint
        </span>
      </Link>

      <nav
        aria-label="Primary"
        className="flex items-center gap-6 text-sm transition-[gap] duration-300 group-data-[scrolled=true]:gap-4 motion-reduce:transition-none"
      >
        <Link
          href="/#hints"
          className="text-muted-foreground hover:text-foreground underline-offset-4 transition-colors hover:underline"
        >
          All hints
        </Link>
        <Link
          href="/#how"
          className="text-muted-foreground hover:text-foreground hidden underline-offset-4 transition-colors hover:underline sm:inline"
        >
          How it works
        </Link>
      </nav>
    </div>
  );
}
