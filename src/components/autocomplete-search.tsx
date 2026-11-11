"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";
import { articleSuggestionsQueryOptions } from "@/queries/articles";
import type { ArticleSuggestion } from "@/queries/articles";

export type Suggestion = ArticleSuggestion;

type AutocompleteSearchProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function AutocompleteSearch({
  value,
  onValueChange,
  placeholder = "Search a city, a country, or a mood…",
  className,
}: AutocompleteSearchProps) {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const debounced = useDebouncedValue(value.trim(), 200);

  const { data, isFetching } = useQuery({
    ...articleSuggestionsQueryOptions(debounced),
    enabled: debounced.length > 0,
  });

  const loading = debounced.length > 0 && isFetching;
  // Only show suggestions for the settled term, so a stale result from the
  // previous keystroke can never be clicked.
  const items: Suggestion[] = debounced ? (data ?? []) : [];

  // "/" focuses the field, the way a command palette would.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (!typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      <Autocomplete.Root
        items={items}
        mode="none"
        value={value}
        onValueChange={(next) => onValueChange(next)}
        onOpenChange={setOpen}
        itemToStringValue={(item: Suggestion) => item.label}
      >
        <label htmlFor={inputId} className="sr-only">
          Search travel hints
        </label>

        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
          >
            <circle cx="10.75" cy="10.75" r="6" />
            <path d="m15.5 15.5 4 4" />
          </svg>

          <Autocomplete.Input
            ref={inputRef}
            id={inputId}
            placeholder={placeholder}
            className="border-border bg-background/80 text-foreground placeholder:text-muted-foreground/80 focus:border-primary/50 focus:ring-ring h-12 w-full rounded-full border pr-16 pl-11 text-[0.95rem] shadow-sm transition-colors focus:ring-2 focus:outline-none"
          />

          <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
            {value ? (
              <button
                type="button"
                onClick={() => {
                  onValueChange("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="text-muted-foreground hover:bg-muted hover:text-foreground grid size-6 place-items-center rounded-full transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            ) : (
              <kbd className="border-border bg-muted text-muted-foreground hidden rounded border px-1.5 py-0.5 text-[0.65rem] sm:block">
                /
              </kbd>
            )}
          </div>
        </div>

        <Autocomplete.Portal>
          <Autocomplete.Positioner sideOffset={8} className="z-50 outline-none">
            <Autocomplete.Popup className="border-border bg-popover text-popover-foreground w-[var(--anchor-width)] max-w-[var(--available-width)] overflow-hidden rounded-2xl border p-1.5 shadow-xl shadow-black/10">
              <Autocomplete.Empty>
                {open && !loading && debounced ? (
                  <p className="text-muted-foreground px-3 py-3 text-sm">
                    Nothing matches “{value.trim()}”. Try a city or a country.
                  </p>
                ) : null}
              </Autocomplete.Empty>

              {loading ? (
                <p className="text-muted-foreground px-3 py-3 text-xs tracking-[0.16em] uppercase">
                  Searching…
                </p>
              ) : null}

              <Autocomplete.List className="max-h-[min(20rem,var(--available-height))] overflow-y-auto overscroll-contain outline-none">
                {(item: Suggestion) => (
                  <Autocomplete.Item
                    key={`${item.type}-${item.slug}`}
                    value={item}
                    onClick={() => {
                      if (item.type === "article") {
                        router.push(`/articles/${item.slug}`);
                        return;
                      }

                      onValueChange(item.label);
                    }}
                    className="data-highlighted:bg-muted flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {item.label}
                      </span>
                      <span className="text-muted-foreground block truncate text-xs">
                        {item.sublabel}
                      </span>
                    </span>
                    <span className="text-muted-foreground shrink-0 text-[0.6rem] tracking-[0.14em] uppercase">
                      {item.type === "destination" ? "City" : "Hint"}
                    </span>
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    </div>
  );
}
