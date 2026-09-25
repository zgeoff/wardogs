import type { PlacedPiece } from '@wardogs-love/fob';
import type { StampPiece } from './types';

// the pieces as a stamp: each one's place relative to the group's lowest corner cell and its
// lowest base, so the group can land anywhere as a unit
export function buildStamp(pieces: readonly PlacedPiece[]): readonly StampPiece[] {
  const minX = Math.min(...pieces.map((piece) => piece.x));
  const minZ = Math.min(...pieces.map((piece) => piece.z));
  const minElevation = Math.min(...pieces.map((piece) => piece.elevation));

  return pieces.map((piece) => ({
    pieceID: piece.pieceID,
    x: piece.x - minX,
    z: piece.z - minZ,
    elevation: Math.round((piece.elevation - minElevation) * 100) / 100,
    rotation: piece.rotation,
  }));
}
