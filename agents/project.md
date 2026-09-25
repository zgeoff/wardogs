# wardogs ❤️

A suite of tools for the game Wardogs, served as one TanStack Start app. The first tool is the FOB
planner (`docs/fob-tool.md`).

## Layout

- `apps/web`: the TanStack Start app. SSR renders the shell; a tool route that needs the browser
  (the FOB planner) sets `ssr: false`.
- `apps/web-e2e`: Playwright specs against the built app.
- `libs/wardogs/game-data`: the piece catalog and its zod schema. Game numbers live here as data,
  never in code.
- `libs/wardogs/fob`: the FOB plan model: grid, placement, intersection, stages, totals, and the
  plan document's schema and share encoding. Pure TypeScript, no React.
- `libs/wardogs/fob-editor`: the planner UI: react-three-fiber scene, zustand store, panels.
- `libs/core/storage`: the versioned document store (`{ id, tool, schemaVersion, data }`) and its
  IndexedDB implementation.
- `libs/design/*`: `panda-preset` (tokens and theme), `styled-system` (Panda codegen, the only
  package that runs full `panda`), `design-system` (Ark UI components and Ladle stories).

## Commands

- `bun run dev` starts the app on port 3000; `bun run ladle` starts the component stories.
- `bun run lint`, `bun run typecheck`, `bun run test`, `bun run format:check`, `bun run deadcode`
  are the checks CI runs. `bun run e2e` builds the app and runs Playwright.
- Codegen output (`styled-system/`, `routeTree.gen.ts`) is gitignored; `bun run codegen` writes it,
  and every check that needs it depends on it through turbo.

## Workspace dependencies

- Shared versions live in the root catalog; workspace packages reference them with `catalog:`.
- `bunfig.toml` holds new versions back for 7 days. The `@zgeoff/*` packages from zgeoff/tools are
  listed in `minimumReleaseAgeExcludes` until their pinned version passes that age.
- The root depends on `@tsconfig/strictest` directly. Panda's config loader resolves a tsconfig
  `extends` from the symlinked path, not the real one, so it misses the copy inside
  `@zgeoff/tsconfig`'s own dependencies.
- Panda 2 drops the `paddingX`/`paddingY` family; write `paddingInline`/`paddingBlock`.

## Testing

Load the `testing` skill before writing a test. Pure libraries run under the root preload; React
packages add `@zgeoff/bun-test-react` (and its `zustand` preload) in their own `bunfig.toml`.

## Runtime

Production runs the Start server build under Bun, served through `srvx` (`apps/web/server.ts`).

## Function naming additions

The repo adds three verbs to the shared taxonomy, for the pure plan edits in `libs/wardogs/fob`.
Each returns a new plan and never changes its argument.

| Prefix   | Contract                              | Example              |
| -------- | ------------------------------------- | -------------------- |
| `add`    | a plan with the item appended         | `addPlacedPiece`     |
| `move`   | a plan with the items offset          | `movePlacedPieces`   |
| `rotate` | a plan with the items turned in place | `rotatePlacedPieces` |
