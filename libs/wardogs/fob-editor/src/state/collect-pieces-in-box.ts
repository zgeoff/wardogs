import { buildPieceBox } from '@wardogs-love/fob';
import type { Plan } from '@wardogs-love/fob';
import type { GroundPoint } from './types';

// the visible pieces whose footprint touches the rectangle between two ground points
interface GroundRect {
  readonly corner: GroundPoint;
  readonly opposite: GroundPoint;
}

export function collectPiecesInBox(plan: Plan, viewStage: number, rect: GroundRect): string[] {
  const corner = rect.corner;
  const opposite = rect.opposite;
  const minX = Math.min(corner.x, opposite.x);
  const maxX = Math.max(corner.x, opposite.x);
  const minZ = Math.min(corner.z, opposite.z);
  const maxZ = Math.max(corner.z, opposite.z);

  return plan.pieces
    .filter((piece) => {
      if (piece.stage > viewStage) {
        return false;
      }

      const box = buildPieceBox(piece);

      return box.max.x > minX && box.min.x < maxX && box.max.z > minZ && box.min.z < maxZ;
    })
    .map((piece) => piece.id);
}
