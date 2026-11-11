import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[55vh] flex-col items-start justify-center py-16">
      <p className="text-muted-foreground text-[0.68rem] font-medium tracking-[0.3em] uppercase">
        404 · Off the map
      </p>
      <h1 className="font-heading mt-4 max-w-2xl text-4xl leading-[0.98] tracking-[-0.02em] text-balance sm:text-6xl">
        This hint wandered off without leaving a forwarding address.
      </h1>
      <p className="text-muted-foreground mt-5 max-w-md">
        The page you were looking for does not exist. The notebook, however, is
        still open.
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground mt-8 inline-flex rounded-full px-6 py-2.5 text-sm transition-opacity hover:opacity-90"
      >
        Back to the hints
      </Link>
    </section>
  );
}
