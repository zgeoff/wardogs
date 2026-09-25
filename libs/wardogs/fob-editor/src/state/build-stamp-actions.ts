import { addPlacedPiece, hasCollision } from '@wardogs-love/fob';
import { buildPlanCommit } from './build-plan-commit';
import { buildStamp } from './build-stamp';
import { buildStampGhosts } from './build-stamp-ghosts';
import type { CellOffset, EditorAPI, EditorActions } from './types';

type StampActions = Pick<
  EditorActions,
  'buildStampGhosts' | 'pickClipboard' | 'placeStamp' | 'setClipboard'
>;

// copy and paste: Ctrl+C keeps the selected pieces as a stamp, and Ctrl+V puts the stamp on the
// cursor, where each click lands a copy of the whole group
export function buildStampActions(api: EditorAPI): StampActions {
  return {
    setClipboard: () => {
      const state = api.get();
      const pieces = state.plan.pieces.filter((piece) => state.selection.has(piece.id));

      if (pieces.length === 0) {
        return false;
      }

      api.set({ clipboard: buildStamp(pieces) });

      return true;
    },
    pickClipboard: () => {
      const clipboard = api.get().clipboard;

      if (clipboard === null) {
        return false;
      }

      api.set({
        tool: 'place',
        palettePieceID: null,
        stamp: clipboard,
        ghostLift: 0,
        paint: null,
        selection: new Set(),
      });

      return true;
    },
    buildStampGhosts: (cell) => {
      const state = api.get();

      return state.stamp === null
        ? []
        : buildStampGhosts({
            plan: state.plan,
            stamp: state.stamp,
            cell,
            lift: state.ghostLift,
            stage: state.viewStage,
          });
    },
    placeStamp: (cell) => placeStamp(api, cell),
  };
}

// a copy lands whole or not at all: any piece of it that would intersect blocks the paste
function placeStamp(api: EditorAPI, cell: CellOffset): boolean {
  const state = api.get();

  const pieces = state.buildStampGhosts(cell).map((piece) => ({
    id: crypto.randomUUID(),
    pieceID: piece.pieceID,
    x: piece.x,
    z: piece.z,
    elevation: piece.elevation,
    rotation: piece.rotation,
    stage: piece.stage,
  }));

  if (pieces.length === 0) {
    return false;
  }

  const plan = pieces.reduce((current, piece) => addPlacedPiece(current, piece), state.plan);

  if (hasCollision(plan, new Set(pieces.map((piece) => piece.id)))) {
    return false;
  }

  api.set(buildPlanCommit(state, plan));

  return true;
}
