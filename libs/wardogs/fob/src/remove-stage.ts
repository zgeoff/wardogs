import type { Plan } from './types';

// the removed stage's pieces join the stage before it (or the next one, for stage 1), and every
// later stage moves down one; no piece is copied or lost
export function removeStage(plan: Plan, stage: number): Plan {
  if (plan.stageCount === 1) {
    throw new RangeError('a plan keeps at least one stage');
  }

  if (!Number.isInteger(stage) || stage < 1 || stage > plan.stageCount) {
    throw new RangeError(`stage ${stage} is outside the plan's stages 1 to ${plan.stageCount}`);
  }

  return {
    stageCount: plan.stageCount - 1,
    pieces: plan.pieces.map((piece) =>
      piece.stage >= stage && piece.stage > 1 ? { ...piece, stage: piece.stage - 1 } : piece,
    ),
  };
}
