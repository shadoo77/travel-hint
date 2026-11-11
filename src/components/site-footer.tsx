export function SiteFooter() {
  return (
    <footer className="border-border/70 mt-24 border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-10 text-sm sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div className="max-w-sm">
          <p className="font-heading text-foreground text-lg">Trav.Hint</p>
          <p className="mt-1.5 text-pretty">
            A small notebook of things worth doing once you stop taking pictures
            of them.
          </p>
        </div>
        <p className="text-xs tracking-[0.18em] uppercase">
          Photos · Wikimedia Commons
        </p>
      </div>
    </footer>
  );
}
