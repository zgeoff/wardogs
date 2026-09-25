import { buildPieceBox } from '@wardogs-love/fob';
import type { Plan } from '@wardogs-love/fob';
import type { GroundPoint } from '../state/types';

// the ground point the camera centres on: the plan's first FOB, else its first piece, else the
// origin
export function findFrameTarget(plan: Plan): GroundPoint {
  const piece = plan.pieces.find((candidate) => candidate.pieceID === 'fob') ?? plan.pieces[0];

  if (piece === undefined) {
    return { x: 0, z: 0 };
  }

  const box = buildPieceBox(piece);

  return { x: (box.min.x + box.max.x) / 2, z: (box.min.z + box.max.z) / 2 };
}
