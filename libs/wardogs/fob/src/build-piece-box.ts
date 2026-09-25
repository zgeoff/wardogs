import { getPiece } from '@wardogs-love/game-data';
import { CELL_SIZE } from './constants';
import { getFootprint } from './get-footprint';
import type { Box, PlacedPiece } from './types';

// the collision box sits centred in the piece's footprint, so a piece narrower than its cells
// (a 2.2 m hedgehog in 2.25 m) keeps an even margin on both sides
export function buildPieceBox(placed: PlacedPiece): Box {
  const piece = getPiece(placed.pieceID);
  const footprint = getFootprint(piece, placed.rotation);
  const isQuarterTurned = placed.rotation % 2 === 1;
  const sizeX = isQuarterTurned ? piece.size.depth : piece.size.width;
  const sizeZ = isQuarterTurned ? piece.size.width : piece.size.depth;
  const centreX = (placed.x + footprint.width / 2) * CELL_SIZE;
  const centreZ = (placed.z + footprint.depth / 2) * CELL_SIZE;

  return {
    min: { x: centreX - sizeX / 2, y: placed.elevation, z: centreZ - sizeZ / 2 },
    max: {
      x: centreX + sizeX / 2,
      y: placed.elevation + piece.size.height,
      z: centreZ + sizeZ / 2,
    },
  };
}
