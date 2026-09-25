import {
  addStage,
  hasCollision,
  movePlacedPieces,
  removePlacedPieces,
  removeStage,
  rotatePlacedPieces,
  setPiecesStage,
} from '@wardogs-love/fob';
import type { Plan } from '@wardogs-love/fob';
import { buildPlanCommit } from './build-plan-commit';
import type { CellOffset, EditorAPI, EditorActions } from './types';

type EditActions = Pick<
  EditorActions,
  | 'addStage'
  | 'moveSelection'
  | 'redo'
  | 'removeSelection'
  | 'removeStage'
  | 'rotateSelection'
  | 'setSelectionStage'
  | 'undo'
>;

// changes to the plan that don't place a piece: moving, turning, deleting, restaging, stages,
// and the undo history
export function buildEditActions(api: EditorAPI): EditActions {
  return {
    moveSelection: (offset, metres) => moveSelection(api, offset, metres),
    rotateSelection: () => applyGroupEdit(api, (plan, ids) => rotatePlacedPieces(plan, ids)),
    removeSelection: () => {
      const state = api.get();

      if (state.selection.size > 0) {
        api.set(
          buildPlanCommit(state, removePlacedPieces(state.plan, state.selection), {
            selection: new Set(),
          }),
        );
      }
    },
    setSelectionStage: (stage) => {
      const state = api.get();
      const viewStage = Math.max(state.viewStage, stage);

      api.set(
        buildPlanCommit(state, setPiecesStage(state.plan, state.selection, stage), { viewStage }),
      );
    },
    addStage: () => {
      const plan = addStage(api.get().plan);

      api.set(buildPlanCommit(api.get(), plan, { viewStage: plan.stageCount }));
    },
    removeStage: (stage) => {
      const state = api.get();
      const plan = removeStage(state.plan, stage);
      const viewStage = Math.min(state.viewStage, plan.stageCount);

      api.set(buildPlanCommit(state, plan, { viewStage }));
    },
    undo: () => {
      undoPlanEdit(api);
    },
    redo: () => {
      redoPlanEdit(api);
    },
  };
}

function moveSelection(api: EditorAPI, offset: CellOffset, metres: number): boolean {
  return applyGroupEdit(api, (plan, ids) =>
    movePlacedPieces(plan, ids, { ...offset, elevation: metres }),
  );
}

// applies an edit to the selected pieces unless it would leave one inside another piece
function applyGroupEdit(
  api: EditorAPI,
  edit: (plan: Plan, ids: ReadonlySet<string>) => Plan,
): boolean {
  const state = api.get();

  if (state.selection.size === 0) {
    return false;
  }

  const plan = edit(state.plan, state.selection);

  if (hasCollision(plan, state.selection)) {
    return false;
  }

  api.set(buildPlanCommit(state, plan));

  return true;
}

function undoPlanEdit(api: EditorAPI): void {
  const state = api.get();
  const previous = state.past.at(-1);

  if (previous === undefined) {
    return;
  }

  api.set({
    plan: previous,
    past: state.past.slice(0, -1),
    future: [state.plan, ...state.future],
    revision: state.revision + 1,
    selection: new Set(),
    viewStage: Math.min(state.viewStage, previous.stageCount),
  });
}

function redoPlanEdit(api: EditorAPI): void {
  const state = api.get();
  const [next, ...future] = state.future;

  if (next === undefined) {
    return;
  }

  api.set({
    plan: next,
    past: [...state.past, state.plan],
    future,
    revision: state.revision + 1,
    selection: new Set(),
    viewStage: Math.min(state.viewStage, next.stageCount),
  });
}
