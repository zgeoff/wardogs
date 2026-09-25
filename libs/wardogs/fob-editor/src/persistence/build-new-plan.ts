import type { Plan } from '@wardogs-love/fob';

// a fresh plan starts with its FOB near the origin, so the build square shows from the first frame
export function buildNewPlan(): Plan {
  return {
    stageCount: 1,
    pieces: [
      {
        id: crypto.randomUUID(),
        pieceID: 'fob',
        x: -2,
        z: -2,
        elevation: 0,
        rotation: 0,
        stage: 1,
      },
    ],
  };
}
