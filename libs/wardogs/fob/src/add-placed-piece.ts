import type { PlacedPiece, Plan } from './types';

export function addPlacedPiece(plan: Plan, placed: PlacedPiece): Plan {
  return { ...plan, pieces: [...plan.pieces, placed] };
}
