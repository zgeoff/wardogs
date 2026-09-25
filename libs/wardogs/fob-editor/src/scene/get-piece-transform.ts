import { buildPieceBox } from '@wardogs-love/fob';
import type { PlacedPiece } from '@wardogs-love/fob';

export interface PieceTransform {
  readonly position: readonly [number, number, number];
  readonly size: readonly [number, number, number];
  readonly rotationY: number;
}

// a placed piece in the scene: the centre of its collision box, the box's size along x, y and z in
// metres, and the turn about y that faces its model. A piece turns clockwise seen from above, and
// three.js turns counter-clockwise for a positive angle, so the angle is negative.
export function getPieceTransform(piece: PlacedPiece): PieceTransform {
  const box = buildPieceBox(piece);

  return {
    position: [
      (box.min.x + box.max.x) / 2,
      (box.min.y + box.max.y) / 2,
      (box.min.z + box.max.z) / 2,
    ],
    size: [box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z],
    rotationY: (-piece.rotation * Math.PI) / 2,
  };
}
