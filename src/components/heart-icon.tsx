import { cn } from "@/lib/utils";

type HeartIconProps = {
  filled: boolean;
  className?: string;
};

export function HeartIcon({ filled, className }: HeartIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn(
        "size-[1.15em] transition-transform duration-300",
        filled && "scale-110",
        className,
      )}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20.25c-.32 0-.63-.12-.87-.34C7.7 16.8 3.75 13.36 3.75 9.6A4.6 4.6 0 0 1 8.35 5c1.5 0 2.85.72 3.65 1.9A4.53 4.53 0 0 1 15.65 5a4.6 4.6 0 0 1 4.6 4.6c0 3.76-3.95 7.2-7.38 10.31-.24.22-.55.34-.87.34Z" />
    </svg>
  );
}
