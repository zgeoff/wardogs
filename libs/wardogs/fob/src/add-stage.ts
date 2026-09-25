import type { Plan } from './types';

export function addStage(plan: Plan): Plan {
  return { ...plan, stageCount: plan.stageCount + 1 };
}
