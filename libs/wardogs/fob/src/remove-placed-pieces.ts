import type { Plan } from './types';

export function removePlacedPieces(plan: Plan, ids: ReadonlySet<string>): Plan {
  return { ...plan, pieces: plan.pieces.filter((piece) => !ids.has(piece.id)) };
}
