import { rotatePlacedPieces } from '@wardogs-love/fob';
import { buildStamp } from './build-stamp';
import type { StampPiece } from './types';

// the stamp turned a quarter clockwise (seen from above) as one group, the way a selection turns
export function rotateStamp(stamp: readonly StampPiece[]): readonly StampPiece[] {
  const pieces = stamp.map((piece, index) => ({ ...piece, id: String(index), stage: 1 }));

  const turned = rotatePlacedPieces(
    { stageCount: 1, pieces },
    new Set(pieces.map((piece) => piece.id)),
  );

  return buildStamp(turned.pieces);
}
