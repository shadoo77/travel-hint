type HeroProps = {
  hintCount: number;
  cityCount: number;
};

export function Hero({ hintCount, cityCount }: HeroProps) {
  return (
    <section className="grain relative overflow-hidden pt-10 pb-14 sm:pt-16 sm:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-[26rem] sm:w-[34rem]"
        style={{
          background:
            "radial-gradient(58% 46% at 72% 34%, color-mix(in oklab, var(--accent) 85%, transparent) 0%, transparent 72%)",
        }}
      />
      <div className="relative">
        <p className="hero-item text-muted-foreground text-[0.68rem] font-medium tracking-[0.3em] uppercase">
          Field notes · Vol. 01
        </p>

        <h1
          className="hero-item font-heading mt-5 max-w-3xl text-[2.65rem] leading-[0.94] tracking-[-0.02em] text-balance sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "0.09s" }}
        >
          Travel hints that feel like{" "}
          <span className="text-primary italic">advice from a friend</span>, not
          a guidebook.
        </h1>

        <p
          className="hero-item text-muted-foreground mt-6 max-w-xl text-base leading-relaxed text-pretty sm:text-lg"
          style={{ animationDelay: "0.18s" }}
        >
          One city, one habit worth stealing, and the small thing nobody tells
          you. No top-ten lists, no queues, no fomo.
        </p>

        <dl
          className="hero-item border-border/70 mt-10 flex flex-wrap items-end gap-x-10 gap-y-4 border-t pt-5 text-sm"
          style={{ animationDelay: "0.27s" }}
        >
          <div className="flex items-baseline gap-2">
            <dt className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
              Hints
            </dt>
            <dd className="font-heading text-2xl tabular-nums">{hintCount}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
              Cities
            </dt>
            <dd className="font-heading text-2xl tabular-nums">{cityCount}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
              Reading time
            </dt>
            <dd className="font-heading text-2xl tabular-nums">4–6 min</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
