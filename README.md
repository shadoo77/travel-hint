# Trav Hint

Short, honest travel hints: one city, one habit worth stealing, no top-ten lists.
Built with Next.js 16 (App Router, Turbopack), React 19, and a Hono API mounted
through `@hono/vercel`.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| API | Hono 4 via `@hono/vercel`, Zod validation |
| Data | PostgreSQL (Neon) + Prisma 7 with the `prisma-client` generator and Neon driver adapter |
| Client data | TanStack Query v5 over a typed Hono RPC client (`hc<AppType>`) |
| UI | Tailwind CSS v4, shadcn/ui, `@base-ui/react`, lucide-react |

## Features

- Searchable, infinitely scrolling hint feed with a shareable `?q=` URL
- Autocomplete across destinations and article titles
- Anonymous favorites with optimistic updates (visitor id kept in `localStorage`)
- Server-rendered first paint: the page seeds the TanStack Query cache and hydrates it
- Sticky nav that shrinks on scroll, plus a scroll-to-top control

## Getting started

```bash
npm install        # also runs `prisma generate`
npm run db:push    # or: npm run db:migrate
npm run db:seed
npm run dev        # http://localhost:3000
```

Node 20.9+ (Prisma 7 prefers 20.19+/22.12+/24+).

### Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | Pooled Postgres URL used by the app at runtime |
| `DATABASE_URL_UNPOOLED` | recommended | Direct URL for Prisma CLI and migrations |
| `ADMIN_TOKEN` | no | When set, `POST /api/articles` requires `Authorization: Bearer <token>` |
| `NEXT_PUBLIC_SITE_URL` | no | Absolute site URL for metadata (defaults to `http://localhost:3000`) |

## Project structure

```
src/
  app/                        App Router pages, layout, providers
    api/[...route]/route.ts   Hono -> Next adapter (GET/POST/DELETE exports)
  components/                 Server components by default; interactive pieces are client
  hooks/                      Debounce, favorites, scroll threshold
  lib/
    api.ts                    Typed RPC client + `unwrap`/`ApiError`
    query-client.ts           Per-request server client, browser singleton
    visitor.ts                Anonymous visitor id
  queries/                    TanStack Query keys and queryOptions
  server/
    app.ts                    Hono composition + AppType
    routes/                   One chained Hono per resource
    controllers/              Handlers built with factory.createHandlers()
    middleware/               Zod validation hook, admin guard
    schemas/                  Pure Zod schemas (shared with the client)
    services/                 Prisma data access
    db.ts                     PrismaClient with the Neon adapter
prisma/
  schema.prisma               Destination, Article, Favorite
  migrations/                 SQL migrations
  seed.sql                    Idempotent demo data
```

## API

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/hello?name=` | Smoke test |
| GET | `/api/db/health` | `SELECT 1` against Postgres |
| GET | `/api/articles?q&page&limit&sort` | `sort`: `newest` \| `popular`; `limit` &le; 24 |
| GET | `/api/articles/suggestions?q` | Destinations plus article titles |
| GET | `/api/articles/:slug` | Article with related hints |
| POST | `/api/articles` | Admin-token guarded; creates the destination on the fly |
| POST | `/api/articles/:id/favorite` | Requires `x-visitor-id: <uuid>` |
| DELETE | `/api/articles/:id/favorite` | Requires `x-visitor-id: <uuid>` |

Every error response has the same shape:

```json
{ "error": { "code": "NOT_FOUND", "message": "Article not found" } }
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Next dev server on port 3000 |
| `npm run build` / `npm run start` | `prisma generate` + production build / serve |
| `npm run lint` | ESLint with the flat config |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:pull` / `db:push` / `db:migrate` | Prisma schema sync |
| `npm run db:studio` | Prisma Studio |
| `npm run db:seed` | Apply `prisma/seed.sql` |

There is no test runner. Verify changes with `npx tsc --noEmit && npm run lint && npm run build`.

## Deploy

Import the repo into Vercel and set `DATABASE_URL` and `DATABASE_URL_UNPOOLED`
(plus `NEXT_PUBLIC_SITE_URL` and `ADMIN_TOKEN` if you use them). `npm run build`
runs `prisma generate` before `next build`.

## Notes

- The generated Prisma client is written to `src/generated/prisma` and is gitignored; `postinstall` and `build` recreate it.
- Client-side fetching goes through `src/queries/*` — components never call `fetch` directly.
- RPC types depend on chained Hono routes: keep `new Hono().get(...).post(...)` in route files and `.route(...)` mounts in `app.ts`.
