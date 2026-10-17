---
name: project-code-style
description:
  wardogs' own function verbs and code rules, on top of the shared code-style skill. Load it with
  code-style before writing, reviewing, or renaming any TypeScript in this repo.
---

# Project code style

The shared `code-style` skill holds the function-verb taxonomy and the module rules. This skill adds
the verbs and rules that only wardogs uses, and it never relaxes a rule there.

## Project verbs

The `zgeoff/function-verb` rule in [`.oxlintrc.json`](../../../.oxlintrc.json) lists the same verbs,
and `check-project-verbs.sh` in the code-style skill fails when the two lists differ. The plan edits
in `libs/wardogs/fob` return a new plan and never change their argument, and the editor's store
actions change the store.

| Prefix   | Contract                                                    | Example              |
| -------- | ----------------------------------------------------------- | -------------------- |
| `add`    | a plan with the item appended                               | `addPlacedPiece`     |
| `move`   | a plan with the items offset                                | `movePlacedPieces`   |
| `rotate` | a plan with the items turned in place                       | `rotatePlacedPieces` |
| `place`  | put the picked piece into the plan                          | `placeGhost`         |
| `lift`   | raise or lower something in the scene                       | `liftGhost`          |
| `select` | change which pieces the select tool holds                   | `selectPieces`       |
| `undo`   | step the plan back through its history                      | `undoPlanEdit`       |
| `redo`   | step the plan forward through its history, reversing `undo` | `redoPlanEdit`       |
| `end`    | finish a pointer gesture and apply its result               | `endGesture`         |
| `skip`   | a stand-in that does nothing, for a hook a library requires | `skipRaycast`        |

## Panda

Panda 2 drops the `paddingX` and `paddingY` family. Write `paddingInline` and `paddingBlock`.
