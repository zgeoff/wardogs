# Agent Guidelines

This repo is wardogs, a suite of tools for the game Wardogs, served as one TanStack Start app. The
first tool is the FOB planner, which `docs/fob-tool.md` describes.

## Required reading

The rules a task needs are not repeated here. Load the skill for the work before starting it.

| Skill                | Load before                                                                             |
| -------------------- | --------------------------------------------------------------------------------------- |
| `code-style`         | writing, reviewing, or renaming any TypeScript — the function-verb taxonomy lives there |
| `project-code-style` | the same, beside `code-style` — wardogs' own verbs and code rules                       |
| `testing`            | designing, writing, or reviewing tests                                                  |
| `docs-writing`       | writing or editing any committed prose: `docs/`, READMEs, this file, skills             |

## Repo structure

wardogs is one Bun workspace. Every package takes the name `@wardogs-love/<folder>` and is consumed
as source through an `exports` map that points at `src/index.ts`.

```text
apps/
  web/             the TanStack Start app; SSR renders the shell, and a tool route that needs the
                   browser, such as the FOB planner, sets `ssr: false`
  web-e2e/         Playwright specs against the built app
libs/
  wardogs/
    game-data/     the piece catalog and its zod schema; game numbers live here as data, never in
                   code
    fob/           the FOB plan model: grid, placement, intersection, stages, totals, and the plan
                   document's schema and share encoding; pure TypeScript, no React
    fob-editor/    the planner UI: react-three-fiber scene, zustand store, panels
    fob-share/     the short-link store: SQLite through Kysely, keyed by a cut of each share code's
                   hash; server only
  core/storage/    the versioned document store ({ id, tool, schemaVersion, data }) and its
                   IndexedDB implementation
  design/
    panda-preset/  Panda tokens and theme
    styled-system/ Panda codegen; the only package that runs full `panda`
    design-system/ Ark UI components and Ladle stories
infra/             the Pulumi program for the Cloudflare side of wardogs.love (infra/README.md)
docs/              what each tool does
```

## Packages

- Every external version lives once, in the root `workspaces.catalog`. A package writes `"catalog:"`
  for an external dependency and `"workspace:*"` for an internal one.
- Pin exact versions, with no `^` or `~` ranges. `bun add` saves exact versions, so the rule covers
  hand-written edits.
- `bunfig.toml` holds new versions back for 7 days. The `@zgeoff/*` packages from zgeoff/tools stay
  in `minimumReleaseAgeExcludes` until their pinned version passes that age.
- The root depends on `@tsconfig/strictest` directly. Panda's config loader resolves a tsconfig
  `extends` from the symlinked path, not the real one, so it misses the copy inside
  `@zgeoff/tsconfig`'s own dependencies.
- Vite bundles the workspace libs into the server build but leaves their npm imports external, and
  the Docker image installs only `apps/web`'s `dependencies`. So a server-side lib's npm packages
  (`kysely`, `kysely-bun-worker`, `zod`) are `apps/web` dependencies too, and `knip.json` ignores
  the ones `apps/web` never imports itself.

## Commands

- `bun run dev` starts the app on port 3000, and `bun run ladle` starts the component stories.
- `bun run lint`, `bun run typecheck`, `bun run test`, `bun run format:check`, `bun run deadcode` and
  `bun run audit` are the checks that `pr.yml` runs. `bun run e2e` builds the app and runs
  Playwright, and `e2e.yml` runs it on a pull request.
- `bun run format` fixes formatting.
- Codegen output (`styled-system/`, `routeTree.gen.ts`) is gitignored. `bun run codegen` writes it,
  and every check that needs it depends on it through turbo.
- `bun test` reads the `bunfig.toml` in its working directory, so each package's `bunfig.toml` lists
  its own test preloads. React packages add `@zgeoff/bun-test-react`, and `fob-editor` adds its
  `zustand` preload.

## Deploy and runtime

- `main.yml` runs the checks and e2e on a push to `main`, then deploys to Fly from the repo root with
  `apps/web/fly.toml`. `GIT_SHA` reaches every machine, and `/health` reports it.
- Production runs the Start server build under Bun, served through `srvx` (`apps/web/server.ts`).
  `.bun-version` pins Bun, and Bun 1.3.10 fails to load `react-dom/server` under
  `NODE_ENV=production`.
- Short share links live in SQLite at `DATABASE_PATH`: `/data/wardogs.db` on the Fly volume
  `wardogs_data`, `apps/web/.data/wardogs.db` in dev, and `:memory:` in e2e. The database migrates
  itself on first use.
- The volume pins the app to one machine and to the `rolling` deploy strategy.
- `bun run dev` runs Vite under Bun (`bun --bun`), because the share database runs on `bun:sqlite`
  through `kysely-bun-worker`.
