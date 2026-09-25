import { getRestingElevation } from '@wardogs-love/fob';
import type { PlacedPiece, Plan } from '@wardogs-love/fob';
import type { CellOffset, StampPiece } from './types';

interface StampLanding {
  readonly plan: Plan;
  readonly stamp: readonly StampPiece[];
  readonly cell: CellOffset;
  readonly lift: number;
  readonly stage: number;
}

// the stamp's pieces landed with its corner on the cell: the group settles as one unit, just high
// enough that no piece sinks into what is under it, then rises by the player's lift
export function buildStampGhosts(landing: StampLanding): readonly PlacedPiece[] {
  const pieces = landing.stamp.map((piece, index) => ({
    id: `ghost-${index}`,
    pieceID: piece.pieceID,
    x: landing.cell.x + piece.x,
    z: landing.cell.z + piece.z,
    elevation: piece.elevation,
    rotation: piece.rotation,
    stage: landing.stage,
  }));

  const base = Math.max(
    0,
    ...pieces.map(
      (piece) => getRestingElevation(landing.plan, { ...piece, elevation: 0 }) - piece.elevation,
    ),
  );

  return pieces.map((piece) => ({
    id: piece.id,
    pieceID: piece.pieceID,
    x: piece.x,
    z: piece.z,
    elevation: Math.round((base + landing.lift + piece.elevation) * 100) / 100,
    rotation: piece.rotation,
    stage: piece.stage,
  }));
}
