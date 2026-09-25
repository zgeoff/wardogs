import { pieceCatalog } from './piece-catalog';
import type { Piece } from './types';

export function findPiece(id: string): Piece | undefined {
  return pieceCatalog.find((piece) => piece.id === id);
}
