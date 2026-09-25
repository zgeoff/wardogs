import { getPiece } from '@wardogs-love/game-data';
import { getFootprint } from './get-footprint';
import type { PlacedPiece, Plan, Rotation } from './types';

const NEXT_ROTATION: Readonly<Record<Rotation, Rotation>> = { 0: 1, 1: 2, 2: 3, 3: 0 };

interface CellRect {
  readonly x: number;
  readonly z: number;
  readonly width: number;
  readonly depth: number;
}

// turns the pieces a quarter clockwise (seen from above) as one group, about the centre of their
// combined footprint; a group whose centre sits between cells lands half a cell towards the origin
export function rotatePlacedPieces(plan: Plan, ids: ReadonlySet<string>): Plan {
  const rects = plan.pieces.filter((piece) => ids.has(piece.id)).map((piece) => toCellRect(piece));

  if (rects.length === 0) {
    return plan;
  }

  const pivotX =
    Math.min(...rects.map((rect) => rect.x)) +
    Math.max(...rects.map((rect) => rect.x + rect.width));

  const pivotZ =
    Math.min(...rects.map((rect) => rect.z)) +
    Math.max(...rects.map((rect) => rect.z + rect.depth));

  return {
    ...plan,
    pieces: plan.pieces.map((piece) => {
      if (!ids.has(piece.id)) {
        return piece;
      }

      // doubled coordinates keep a centre between cells a whole number
      const rect = toCellRect(piece);
      const centreX = 2 * rect.x + rect.width - pivotX;
      const centreZ = 2 * rect.z + rect.depth - pivotZ;
      const turnedX = pivotX - centreZ;
      const turnedZ = pivotZ + centreX;

      return {
        ...piece,
        x: Math.floor((turnedX - rect.depth) / 2),
        z: Math.floor((turnedZ - rect.width) / 2),
        rotation: NEXT_ROTATION[piece.rotation],
      };
    }),
  };
}

function toCellRect(piece: PlacedPiece): CellRect {
  const footprint = getFootprint(getPiece(piece.pieceID), piece.rotation);

  return { x: piece.x, z: piece.z, width: footprint.width, depth: footprint.depth };
}
