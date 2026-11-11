const VISITOR_KEY = "trav-hint:visitor";

/**
 * Stable anonymous id so favorites survive a page reload without an account.
 * Returns "" when storage is unavailable (private mode), which the API rejects —
 * the optimistic UI still works for the current session.
 */
export function getVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);

    if (existing) {
      return existing;
    }

    const id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, id);

    return id;
  } catch {
    return "";
  }
}
