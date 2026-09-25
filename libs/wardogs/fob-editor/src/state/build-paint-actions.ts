import { addPlacedPiece, getFootprint, getRestingElevation, hasCollision } from '@wardogs-love/fob';
import type { PlacedPiece, Plan } from '@wardogs-love/fob';
import { getPiece } from '@wardogs-love/game-data';
import { buildPlanCommit } from './build-plan-commit';
import { collectStrideCells } from './collect-stride-cells';
import { findGhostCell } from './find-ghost-cell';
import type { CellOffset, EditorAPI, EditorActions, EditorState, GroundPoint } from './types';

type PaintActions = Pick<EditorActions, 'endPaint' | 'startPaint' | 'updatePaint'>;

// the place tool's drag, a paintbrush: a copy of the picked piece lands on every footprint-sized
// step the pointer passes through, or with Shift held, on every step of a straight line from the
// start; the drag's end places them all as one change
export function buildPaintActions(api: EditorAPI): PaintActions {
  return {
    startPaint: (point) => {
      startPaint(api, point);
    },
    updatePaint: (point, isLocked) => {
      updatePaint(api, point, isLocked);
    },
    endPaint: () => endPaint(api),
  };
}

function startPaint(api: EditorAPI, point: GroundPoint): void {
  const state = api.get();
  const origin = findGhostCell(state.palettePieceID, state.ghostRotation, point);

  if (origin === null || state.palettePieceID === null) {
    return;
  }

  const footprint = getFootprint(getPiece(state.palettePieceID), state.ghostRotation);

  api.set({
    paint: {
      origin,
      stride: { x: footprint.width, z: footprint.depth },
      trail: [{ x: 0, z: 0 }],
      cells: [origin],
    },
  });
}

function updatePaint(api: EditorAPI, point: GroundPoint, isLocked: boolean): void {
  const state = api.get();
  const stroke = state.paint;
  const cell = findGhostCell(state.palettePieceID, state.ghostRotation, point);

  if (stroke === null || cell === null) {
    return;
  }

  const step = {
    x: Math.round((cell.x - stroke.origin.x) / stroke.stride.x),
    z: Math.round((cell.z - stroke.origin.z) / stroke.stride.z),
  };

  const trail = buildExtendedTrail(stroke.trail, step);
  const steps = isLocked ? buildLockedLine(step) : trail;

  api.set({
    paint: {
      ...stroke,
      trail,
      cells: steps.map((each) => ({
        x: stroke.origin.x + each.x * stroke.stride.x,
        z: stroke.origin.z + each.z * stroke.stride.z,
      })),
    },
  });
}

// the trail with every step from its last one to the pointer's, each step once
function buildExtendedTrail(trail: readonly CellOffset[], step: CellOffset): readonly CellOffset[] {
  const last = trail.at(-1) ?? { x: 0, z: 0 };

  const visited = new Set(trail.map((trailStep) => toKey(trailStep)));

  return [...trail, ...collectStrideCells(last, step).filter((next) => !visited.has(toKey(next)))];
}

// Shift holds the stroke to one axis: the one the pointer has travelled further along
function buildLockedLine(step: CellOffset): readonly CellOffset[] {
  const isAlongX = Math.abs(step.x) >= Math.abs(step.z);
  const start = { x: 0, z: 0 };
  const end = isAlongX ? { x: step.x, z: 0 } : { x: 0, z: step.z };

  return [start, ...collectStrideCells(start, end)];
}

function endPaint(api: EditorAPI): number {
  const state = api.get();
  const stroke = state.paint;

  api.set({ paint: null });

  if (stroke === null || state.palettePieceID === null) {
    return 0;
  }

  const plan = stroke.cells.reduce((current, cell) => addIfClear(current, state, cell), state.plan);
  const placedCount = plan.pieces.length - state.plan.pieces.length;

  if (placedCount > 0) {
    api.set(buildPlanCommit(state, plan));
  }

  return placedCount;
}

// a copy rests on whatever is under it and is skipped where it would intersect a piece
function addIfClear(plan: Plan, state: EditorState, cell: CellOffset): Plan {
  const piece: PlacedPiece = {
    id: crypto.randomUUID(),
    pieceID: state.palettePieceID ?? '',
    x: cell.x,
    z: cell.z,
    elevation: 0,
    rotation: state.ghostRotation,
    stage: state.viewStage,
  };

  const elevation = Math.round((getRestingElevation(plan, piece) + state.ghostLift) * 100) / 100;
  const next = addPlacedPiece(plan, { ...piece, elevation });

  return hasCollision(next, new Set([piece.id])) ? plan : next;
}

function toKey(step: CellOffset): string {
  return `${step.x}:${step.z}`;
}
