import type { Plan } from './types';

interface Offset {
  readonly x: number;
  readonly z: number;
  readonly elevation: number;
}

// x and z move in whole cells, elevation in metres; a piece never sinks below the ground
export function movePlacedPieces(plan: Plan, ids: ReadonlySet<string>, offset: Offset): Plan {
  return {
    ...plan,
    pieces: plan.pieces.map((piece) =>
      ids.has(piece.id)
        ? {
            ...piece,
            x: piece.x + offset.x,
            z: piece.z + offset.z,
            elevation: Math.max(0, Math.round((piece.elevation + offset.elevation) * 100) / 100),
          }
        : piece,
    ),
  };
}
