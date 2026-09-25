import { collectCollisions } from './collect-collisions';
import type { Plan } from './types';

// true when any named piece intersects a piece outside the named group; the group's own pieces
// never block each other, since they moved together
export function hasCollision(plan: Plan, ids: ReadonlySet<string>): boolean {
  return plan.pieces.some(
    (piece) => ids.has(piece.id) && collectCollisions(plan, piece, ids).length > 0,
  );
}
