import { buildPieceBox } from '@wardogs-love/fob';
import type { PlacedPiece } from '@wardogs-love/fob';

export interface PieceTransform {
  readonly position: readonly [number, number, number];
  readonly size: readonly [number, number, number];
}

// a placed piece as a box mesh: its centre and its size along x, y and z in metres
export function getPieceTransform(piece: PlacedPiece): PieceTransform {
  const box = buildPieceBox(piece);

  return {
    position: [
      (box.min.x + box.max.x) / 2,
      (box.min.y + box.max.y) / 2,
      (box.min.z + box.max.z) / 2,
    ],
    size: [box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z],
  };
}
