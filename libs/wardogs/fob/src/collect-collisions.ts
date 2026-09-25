import { buildPieceBox } from './build-piece-box';
import { hasBoxOverlap } from './has-box-overlap';
import type { PlacedPiece, Plan } from './types';

// the pieces of the plan that the candidate would intersect; pieces named in `ignoredIDs` (the
// ones being moved with it) and the candidate itself never count
export function collectCollisions(
  plan: Plan,
  candidate: PlacedPiece,
  ignoredIDs: ReadonlySet<string> = new Set(),
): PlacedPiece[] {
  const candidateBox = buildPieceBox(candidate);

  return plan.pieces.filter(
    (piece) =>
      piece.id !== candidate.id &&
      !ignoredIDs.has(piece.id) &&
      hasBoxOverlap(candidateBox, buildPieceBox(piece)),
  );
}
