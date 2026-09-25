import { CELL_SIZE, getFootprint } from '@wardogs-love/fob';
import type { Rotation } from '@wardogs-love/fob';
import { getPiece } from '@wardogs-love/game-data';
import type { CellOffset, GroundPoint } from './types';

// the corner cell that centres the picked piece's footprint on the pointer
export function findGhostCell(
  pieceID: string | null,
  rotation: Rotation,
  pointer: GroundPoint | null,
): CellOffset | null {
  if (pieceID === null || pointer === null) {
    return null;
  }

  const footprint = getFootprint(getPiece(pieceID), rotation);

  return {
    x: Math.round(pointer.x / CELL_SIZE - footprint.width / 2),
    z: Math.round(pointer.z / CELL_SIZE - footprint.depth / 2),
  };
}
