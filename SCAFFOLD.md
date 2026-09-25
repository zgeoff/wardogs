# Scaffold brief

The decisions for the first task in this repo: project scaffolding. Delete this file in the scaffold
PR once its content lives in `README.md`, `agents/project.md`, and `docs/`.

## The product

- **wardogs ❤️** — a suite of tools for the video game Wardogs. The UI and README show the name as
  "wardogs ❤️"; the "love" in the domain is silent.
- The first tool is a grid-based editor for mocking up base layouts: buildings that snap together
  into a defensible base. More tools follow, so nothing is named after the layout editor alone.
- Repo `zgeoff/wardogs` (public, not yet created). Domain `wardogs.love`. npm scope
  `@wardogs-love/*`.

## Architecture

- **One deployable to start.** A TanStack Start app on Fly serves the SSR shell and, later, the typed
  API. Multi-service is allowed later (a worker, a separate API); microservices on the scale of vers
  are not.
- **SSR for the shell, client rendering where needed.** Start's selective SSR (`ssr: false` or
  `'data-only'` per route) lets the grid move client-side route by route. Where that line falls is
  decided in the design session, not in the scaffold.
- **Offline first.** v1 needs no backend. Saved work is a versioned document,
  `{ id, tool, schemaVersion, data }`, with a zod schema and migrations per tool, behind a storage
  interface. v1 has an IndexedDB implementation only (the `idb` pattern from vers
  `libs/game/idle-client`).
- **Backend later, without rework.** oRPC contracts in `contracts/*`, served from a Start server route
  (`/api/rpc/$`) and called in-process on the server. Google sign-in with a sealed session cookie
  (vers's `getSession` pattern); check Better Auth's current TanStack Start support before choosing
  it. Kysely on Postgres (Neon or Fly Postgres). None of this is in v1.
- **Layout** (vers's naming):

  ```
  apps/web                    TanStack Start: shell + one route per tool (/base-layout, …)
  apps/web-e2e                Playwright
  libs/wardogs/game-data      building catalog + zod schemas, shared by every tool
  libs/wardogs/base-layout    pure grid logic: placement, snapping, validation — no React
  libs/design/*               panda-preset, styled-system, design-system (Ark UI + Ladle)
  libs/core/storage           document store interface + IndexedDB implementation
  contracts/*                 (later) oRPC contracts
  ```

## Stack

Same as vers where it fits: Bun workspace with a version catalog, turbo, TypeScript 7, React 19,
Vite 8, the React Compiler, TanStack Start/Router/Query, Panda CSS (vers's three-package split,
new theme), zustand, `bun test` + happy-dom + Testing Library, Playwright. Leave out RSC and the MSW
mock-backend plugin.

**Runtime:** Bun in production (`oven/bun` image serving through `srvx`). vers uses Node for no known
reason; if Start's server build fails under Bun, report it before falling back to Node.

## Shared tooling to consume (not copy)

All published from zgeoff/tools:

| Package | Use |
| --- | --- |
| `@zgeoff/tsconfig` 1.0.0 | extend `react.json` (web, design libs) and `base.json` (pure libs) |
| `@zgeoff/oxlint-config` | `.oxlintrc.json` extends it |
| `@zgeoff/oxfmt-config` | `oxfmt.config.ts` spreads it; add repo ignores (router typegen, Panda output) |
| `@zgeoff/commitlint-config` | `commitlint.config.js` extends it |
| `@zgeoff/format-codemod` | the `format` script's second step |
| `@zgeoff/bun-test-extended` | first test preload |
| `@zgeoff/bun-test-react` | preloads `…/zustand` then the main entry, for the web app and design system |

**repo-sync** (`sync/README.md` in zgeoff/tools has the full setup):

1. Set `REPO_SYNC_APP_CLIENT_ID` and `REPO_SYNC_APP_PRIVATE_KEY` from
   `op://zgeoff/repo-sync-github-app/{client-id,private-key}` (the `zgeoff-sync-bot` App is installed
   on all repos).
2. Add `agents/project.md`, and the stub with
   `include: workflow-bun-pr, skill-testing, skill-docs-writing`.
3. Dispatch it once. It delivers `AGENTS.md`, the PR template, `.editorconfig`, the shared skills,
   and `.github/workflows/pr.yml` (the reusable Bun checks; set the `BUN_CHECK_SCRIPTS` repo variable
   if the script list differs from `audit deadcode format:check lint typecheck test`).

**CodeRabbit** is installed and reads the central zgeoff/coderabbit config; add a
`.coderabbit.yaml` with `inheritance: true` only for wardogs-specific instructions.

## Hosting

- **Fly:** one app, Dockerfile without `turbo prune`, `fly.toml` with a `/health` check, suspend,
  and bluegreen deploys. `main.yml` deploys with `flyctl deploy --remote-only` and sets `GIT_SHA` on
  each machine.
- **Cloudflare:** Pulumi manages DNS for wardogs.love, with state in R2 and secrets through
  `op run` (vers `infra/` pattern, minus Axiom, Neon, and Tinybird). A **proxied** record with Full
  (strict) TLS and a cache rule for hashed `/assets/*` — unlike vers, which sets `proxied: false`.
- **Later:** Sentry/Bugsink and Umami (existing instances, new project and website IDs).

## Working agreements

- PRs go out in batches; each one green with every CodeRabbit finding answered (fixed with the
  commit cited, or declined with the reason) and its thread resolved.
- The user merges, or says so explicitly for a batch.
- Tests follow the shared `testing` skill: `setupTest` + `await using` as the only local function, no
  lifecycle hooks in test files, `toStrictEqual`/`toMatchObject` never `toEqual`, one subject per
  test.
