import { getPiece } from '@wardogs-love/game-data';
import { buildPieceBox } from './build-piece-box';
import { FOB_AREA_HALF_EXTENT } from './constants';
import type { Box, PlacedPiece, Plan } from './types';

const EDGE_TOLERANCE = 0.01;

// true when the piece needs a FOB and no FOB's square holds its whole footprint
export function isOutsideFOBArea(plan: Plan, placed: PlacedPiece): boolean {
  if (!getPiece(placed.pieceID).needsFOB) {
    return false;
  }

  const box = buildPieceBox(placed);

  return !plan.pieces.some(
    (piece) => piece.pieceID === 'fob' && isInsideArea(box, buildPieceBox(piece)),
  );
}

function isInsideArea(box: Box, fobBox: Box): boolean {
  const centreX = (fobBox.min.x + fobBox.max.x) / 2;
  const centreZ = (fobBox.min.z + fobBox.max.z) / 2;
  const reach = FOB_AREA_HALF_EXTENT + EDGE_TOLERANCE;

  return (
    box.min.x >= centreX - reach &&
    box.max.x <= centreX + reach &&
    box.min.z >= centreZ - reach &&
    box.max.z <= centreZ + reach
  );
}
