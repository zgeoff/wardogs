import { findPiece } from './find-piece';
import type { Piece } from './types';

export function getPiece(id: string): Piece {
  const piece = findPiece(id);

  if (piece === undefined) {
    throw new Error(`the piece catalog has no piece "${id}"`);
  }

  return piece;
}
