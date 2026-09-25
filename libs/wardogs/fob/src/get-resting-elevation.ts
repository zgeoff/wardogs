import { buildPieceBox } from './build-piece-box';
import { hasFootprintOverlap } from './has-footprint-overlap';
import type { PlacedPiece, Plan } from './types';

// the height a piece lands at: the top of the tallest piece under its footprint, or the ground
export function getRestingElevation(
  plan: Plan,
  candidate: PlacedPiece,
  ignoredIDs: ReadonlySet<string> = new Set(),
): number {
  const candidateBox = buildPieceBox(candidate);

  const tops = plan.pieces
    .filter((piece) => piece.id !== candidate.id && !ignoredIDs.has(piece.id))
    .map((piece) => buildPieceBox(piece))
    .filter((box) => hasFootprintOverlap(candidateBox, box))
    .map((box) => box.max.y);

  return Math.round(Math.max(0, ...tops) * 100) / 100;
}
