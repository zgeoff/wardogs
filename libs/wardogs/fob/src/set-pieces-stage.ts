import type { Plan } from './types';

export function setPiecesStage(plan: Plan, ids: ReadonlySet<string>, stage: number): Plan {
  if (!Number.isInteger(stage) || stage < 1 || stage > plan.stageCount) {
    throw new RangeError(`stage ${stage} is outside the plan's stages 1 to ${plan.stageCount}`);
  }

  return {
    ...plan,
    pieces: plan.pieces.map((piece) => (ids.has(piece.id) ? { ...piece, stage } : piece)),
  };
}
