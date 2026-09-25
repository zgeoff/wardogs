import type { Plan } from './types';

export function buildEmptyPlan(): Plan {
  return { stageCount: 1, pieces: [] };
}
