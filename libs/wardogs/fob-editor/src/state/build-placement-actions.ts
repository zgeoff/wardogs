import { addPlacedPiece, getRestingElevation, hasCollision } from '@wardogs-love/fob';
import type { PlacedPiece, Rotation } from '@wardogs-love/fob';
import { buildPlanCommit } from './build-plan-commit';
import type { CellOffset, EditorAPI, EditorActions } from './types';

const NEXT_ROTATION: Readonly<Record<Rotation, Rotation>> = { 0: 1, 1: 2, 2: 3, 3: 0 };

type PlacementActions = Pick<
  EditorActions,
  | 'buildGhost'
  | 'cancelTool'
  | 'liftGhost'
  | 'pickPiece'
  | 'pickSelectedPiece'
  | 'placePiece'
  | 'resetTool'
  | 'rotateGhost'
>;

// the place tool: pick a piece from the palette, aim its ghost, and drop it on the grid
export function buildPlacementActions(api: EditorAPI): PlacementActions {
  return {
    pickPiece: (pieceID) => {
      api.set({ tool: 'place', palettePieceID: pieceID, ghostLift: 0, selection: new Set() });
    },
    cancelTool: () => {
      api.set({ tool: 'select', palettePieceID: null, ghostLift: 0 });
    },

    // Esc or a right click: stop placing, or with the select tool, let go of the selection
    resetTool: () => {
      if (api.get().tool === 'place') {
        api.get().cancelTool();
      } else {
        api.get().clearSelection();
      }
    },

    // duplicate: the selected piece (the last one selected, of several) goes on the cursor, turned
    // the same way, to place more of it
    pickSelectedPiece: () => pickSelectedPiece(api),
    buildGhost: (cell) => buildGhost(api, cell),
    placePiece: (cell) => placeGhost(api, cell),
    rotateGhost: () => {
      api.set({ ghostRotation: NEXT_ROTATION[api.get().ghostRotation] });
    },
    liftGhost: (metres) => {
      const ghostLift = toCentimetres(api.get().ghostLift + metres);

      api.set({ ghostLift: Math.max(0, ghostLift) });
    },
  };
}

function pickSelectedPiece(api: EditorAPI): boolean {
  const state = api.get();
  const id = [...state.selection].at(-1);
  const piece = state.plan.pieces.find((placed) => placed.id === id);

  if (piece === undefined) {
    return false;
  }

  api.set({
    tool: 'place',
    palettePieceID: piece.pieceID,
    ghostRotation: piece.rotation,
    ghostLift: 0,
    selection: new Set(),
  });

  return true;
}

function buildGhost(api: EditorAPI, cell: CellOffset): PlacedPiece | null {
  const state = api.get();

  if (state.palettePieceID === null) {
    return null;
  }

  const ghost: PlacedPiece = {
    id: 'ghost',
    pieceID: state.palettePieceID,
    x: cell.x,
    z: cell.z,
    elevation: 0,
    rotation: state.ghostRotation,
    stage: state.viewStage,
  };

  const resting = getRestingElevation(state.plan, ghost);

  return { ...ghost, elevation: toCentimetres(resting + state.ghostLift) };
}

function placeGhost(api: EditorAPI, cell: CellOffset): boolean {
  const ghost = buildGhost(api, cell);

  if (ghost === null) {
    return false;
  }

  const placed = { ...ghost, id: crypto.randomUUID() };
  const plan = addPlacedPiece(api.get().plan, placed);

  if (hasCollision(plan, new Set([placed.id]))) {
    return false;
  }

  api.set(buildPlanCommit(api.get(), plan));

  return true;
}

function toCentimetres(metres: number): number {
  return Math.round(metres * 100) / 100;
}
