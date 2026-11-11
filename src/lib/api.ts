import { hc } from "hono/client";
import type { AppType } from "@/server/app";

/**
 * Typed RPC client. `AppType` already carries `basePath('/api')`, so an empty
 * base URL produces same-origin requests (`/api/articles`, ...) with no env var.
 *
 * The schema keys include the base path, hence the `.api` hop. Factoring it out
 * keeps call sites reading like the routes: `api.articles.$get(...)`.
 *
 * `AppType` is a type-only import: the server module never reaches the bundle.
 */
const client = hc<AppType>("", {
  init: { cache: "no-store" },
});

export const api = client.api;

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type ApiErrorBody = {
  error?: { code?: string; message?: string };
};

/** Structural subset of a typed Hono JSON response. */
type UnwrappableResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

/**
 * Turns a typed Hono response into data or an `ApiError`. Pass the success type
 * from `InferResponseType<typeof api.articles.$get, 200>` so the payload stays
 * derived from the route instead of being re-declared by hand.
 */
export async function unwrap<T>(response: UnwrappableResponse): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  }

  const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
  const message =
    body?.error?.message ?? `Request failed with status ${response.status}`;

  throw new ApiError(
    response.status,
    body?.error?.code ?? "REQUEST_FAILED",
    message,
  );
}
