# wardogs ❤️

Tools for the game [Wardogs](https://www.wardogs.com), at [wardogs.love](https://wardogs.love). The
"love" in the domain is silent.

The first tool is the **FOB planner** (`/fob`). It lays out a forward operating base on a 0.75 m
grid in 3D, splits the build into stages, and shows the supply cost of each stage.
[`docs/fob-tool.md`](docs/fob-tool.md) describes what it models and what it leaves out.

The planner draws each piece as a simple model of our own, sized to its collision box. The game's
models are not licensed for reuse.

## Run it

Install [Bun](https://bun.sh) at the version in `.bun-version` (`bun upgrade` gets the latest
release), then:

```sh
bun install
bun run dev    # the app on http://localhost:3000
bun run ladle  # the component stories
bun run e2e    # build the app and run the Playwright specs
```

Plans save in the browser's IndexedDB. No account and no backend exist.

## Layout

| Path                      | Holds                                                          |
| ------------------------- | -------------------------------------------------------------- |
| `apps/web`                | the TanStack Start app, served by Bun through `srvx`           |
| `apps/web-e2e`            | Playwright specs against the production build                  |
| `libs/wardogs/game-data`  | the piece catalog: sizes, costs, and hit points as data        |
| `libs/wardogs/fob`        | the plan model: grid, intersection, stages, totals, share code |
| `libs/wardogs/fob-editor` | the planner UI: react-three-fiber scene, zustand store, panels |
| `libs/core/storage`       | the versioned document store and its IndexedDB implementation  |
| `libs/design/*`           | the Panda preset, the generated styled system, the components  |
| `infra`                   | the Pulumi program for Cloudflare DNS, TLS, and caching        |
| `docs`                    | the tool specs                                                 |

## The piece catalog

`libs/wardogs/game-data` holds every buildable piece. Each entry records its source and whether it
has been checked in the game. The first numbers come from community research, and each entry keeps
`verifiedInGame: false` until someone checks it in the game. A correction changes the catalog only.

## Deploy

A push to `main` runs the checks and the e2e specs, then deploys to Fly
(`.github/workflows/main.yml`). `infra/README.md` sets up the Cloudflare side.

## Later

The site starts with no backend. When a tool needs one, the plan is:

- oRPC contracts in `contracts/*`, served from a Start server route and called in-process on the
  server
- Google sign-in with a sealed session cookie
- Kysely on Postgres

Saved work is already a versioned document (`{ id, tool, schemaVersion, data }`) behind a storage
interface, so a server store can replace IndexedDB without a change to the tools.

## Contributing

`AGENTS.md` holds the repo rules for people and agents. Commits follow Conventional Commits, and
lefthook runs the formatter, the linter, and commitlint on each commit.
