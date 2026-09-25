import { CELL_SIZE, getFootprint } from '@wardogs-love/fob';
import { getPiece } from '@wardogs-love/game-data';
import type { CellOffset, GroundPoint, StampPiece } from './types';

// the corner cell that centres the stamp's combined footprint on the pointer
export function findStampCell(
  stamp: readonly StampPiece[],
  pointer: GroundPoint | null,
): CellOffset | null {
  if (pointer === null || stamp.length === 0) {
    return null;
  }

  const width = Math.max(
    ...stamp.map((piece) => piece.x + getFootprint(getPiece(piece.pieceID), piece.rotation).width),
  );

  const depth = Math.max(
    ...stamp.map((piece) => piece.z + getFootprint(getPiece(piece.pieceID), piece.rotation).depth),
  );

  return {
    x: Math.round(pointer.x / CELL_SIZE - width / 2),
    z: Math.round(pointer.z / CELL_SIZE - depth / 2),
  };
}
