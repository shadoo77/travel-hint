"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { api, unwrap } from "@/lib/api";
import { getVisitorId } from "@/lib/visitor";

const FAVORITES_KEY = "trav-hint:favorites";
const SYNC_EVENT = "trav-hint:favorites-changed";

type FavoriteResponse = { favorited: boolean; favoriteCount: number };

function readFavorites(): string[] {
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids: string[]) {
  try {
    window.localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify([...new Set(ids)]),
    );
    window.dispatchEvent(new Event(SYNC_EVENT));
  } catch {
    // Storage can throw in private mode; the in-memory state still works for this session.
  }
}

type FavoriteState = {
  favorited: boolean;
  count: number;
  pending: boolean;
  toggle: () => void;
};

/**
 * Optimistic favorite toggle. The visitor id lives in localStorage, the
 * favorited flag is mirrored there so it survives reloads, and the server
 * remains the source of truth for the public counter.
 */
export function useFavorite(
  articleId: string,
  initialCount: number,
): FavoriteState {
  const [favorited, setFavorited] = useState(false);
  const [count, setCount] = useState(initialCount);

  const { mutate, isPending } = useMutation({
    mutationFn: async (next: boolean) => {
      const args = {
        param: { id: articleId },
        header: { "x-visitor-id": getVisitorId() },
      };

      return unwrap<FavoriteResponse>(
        next
          ? await api.articles[":id"].favorite.$post(args)
          : await api.articles[":id"].favorite.$delete(args),
      );
    },
  });

  useEffect(() => {
    const sync = () => setFavorited(readFavorites().includes(articleId));

    sync();
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [articleId]);

  const toggle = useCallback(() => {
    if (isPending) {
      return;
    }

    const next = !favorited;
    const previousCount = count;
    const previousIds = readFavorites();

    setFavorited(next);
    setCount(Math.max(0, previousCount + (next ? 1 : -1)));
    writeFavorites(
      next
        ? [...previousIds, articleId]
        : previousIds.filter((id) => id !== articleId),
    );

    mutate(next, {
      onSuccess: (data) => {
        if (typeof data.favoriteCount === "number") {
          setCount(data.favoriteCount);
        }
      },
      onError: () => {
        setFavorited(!next);
        setCount(previousCount);
        writeFavorites(previousIds);
      },
    });
  }, [articleId, count, favorited, isPending, mutate]);

  return { favorited, count, pending: isPending, toggle };
}
