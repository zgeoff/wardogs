import type { Piece } from '@wardogs-love/game-data';
import { CELL_SIZE } from './constants';
import type { Footprint, Rotation } from './types';

// a size a hair over a whole number of cells (a 3.01 m station) still takes that many cells
const CELL_TOLERANCE = 0.02;

export function getFootprint(piece: Piece, rotation: Rotation): Footprint {
  const width = countCells(piece.size.width);
  const depth = countCells(piece.size.depth);

  return rotation % 2 === 0 ? { width, depth } : { width: depth, depth: width };
}

function countCells(metres: number): number {
  return Math.max(1, Math.ceil(metres / CELL_SIZE - CELL_TOLERANCE));
}
