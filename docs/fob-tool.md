# FOB planner

The first tool in wardogs ❤️: a plain 3D planner for a Wardogs forward operating base (FOB). A
player lays out pieces on a grid, splits the build into stages, and reads the supply cost of each
stage.

## What it models

The planner models space, not the game's building rules. The game snaps pieces through sockets and
limits height through a build order; both have edge cases that the most interesting builds rely on,
and an emulation of them blocks those builds. So the planner leaves them out, and the player applies
them from experience.

- **Grid.** Every piece sits on a 0.75 m grid in world space. The game's pieces measure in 1.5 m
  cubes, and the 0.75 m grid admits the half-cube offsets that players build with.
- **Rotation.** A piece turns in 90° steps.
- **Height.** A new piece lands on the highest surface under its footprint. The player raises or
  lowers it in 0.75 m steps.
- **Intersection.** Two pieces never overlap in 3D. This is the only rule the planner enforces.
- **FOB area.** A FOB claims a 120 m × 120 m square centred on it and turned with it. A piece
  outside every FOB square shows a warning; the planner does not block it.

## Stages

A plan is one list of pieces. Each piece records the stage it is built in, from 1 to the plan's
stage count. Stage _n_ shows every piece built in stages 1 to _n_, with the pieces from earlier
stages dimmed. The planner shows the supply cost of each stage and the running total. Moving a piece
to another stage, or deleting a stage, never copies a piece.

## Pieces

The catalog in `libs/wardogs/game-data` holds each buildable piece: its name, category, size in
metres, supply cost, and hit points. Every entry records the game version and source it came from,
and whether it has been checked in the game. Costs are data, so a rebalance changes the catalog, not
the code.

A saved plan stores piece ids, positions, rotations, and stages. It does not store costs, so its
totals follow the current catalog.

## Rendering

The planner renders with react-three-fiber. The default camera looks straight down with an
orthographic projection; the 3D view orbits the base. Each piece renders as a simple model of our
own, built from boxes and other primitives to fill its collision box, since the game's models are
not licensed for reuse. The models live in `libs/wardogs/fob-editor/src/scene/models`, and a piece
without one renders as a box of its size, coloured by category. A click anywhere in a piece's
collision box selects it, including a gap in a model such as barbed wire.

The `/fob` route renders on the client only. The rest of the site renders on the server.

## Editing

- Pick a piece from the palette, then click to place it. `R` turns it, and `PageUp`/`PageDown` or
  `Ctrl` with the wheel raise and lower it, or the selection, a half module at a time.
- Drag to paint: a copy lands on each footprint-sized step the pointer passes through, and the drag
  places them all as one change. Hold `Shift` to keep the copies on a straight line along the longer
  axis. A copy rests on whatever is under it, and one that would intersect a piece is skipped. A
  right click or `Esc` during a drag drops it.
- A right click, or `Esc`, stops placing; with nothing to place, it clears the selection. A right
  drag still moves the camera.
- `Ctrl+C` copies the selection, and `Ctrl+V` puts the copy on the cursor as one group: each click
  lands a copy of the whole group, settled as a unit on whatever is under it, and `R` turns it. The
  copy stays until the next `Ctrl+C`, so it pastes into another stage too.
- `D` duplicates: one selected piece goes on the cursor, turned the same way, to place or paint more
  of it; with several selected, `D` copies and pastes them as a group.
- Select a piece to move, turn, restage, or delete it. Drag a box to select many. `Shift` with a
  click or a box toggles those pieces in or out of the selection. Press `Ctrl+A` to select every
  piece the current stage shows. Drag the selection or nudge it with the arrow keys to move it.
- Undo and redo cover every change.
- The wheel zooms both cameras. A right drag pans the top view and orbits the 3D view; a middle drag
  pans both. `F` frames the base.

## Saving and sharing

- Plans save to IndexedDB in the browser, with no account. A player keeps many named plans.
- A plan exports to a JSON file and imports from one.
- A share link carries the whole plan in the URL fragment, so sharing needs no server.
- Every saved plan is a versioned document, `{ id, tool, schemaVersion, data }`, so a later schema
  migrates old plans.

## Left out

Terrain and map sites, sightlines and an on-foot view, vehicles, socket snapping, free angles, stack
limits and build order, prefabs, accounts, a community hub, and co-editing.
