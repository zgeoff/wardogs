import { getPiece } from '@wardogs-love/game-data';
import type { Plan, StageTotal } from './types';

export function buildStageTotals(plan: Plan): StageTotal[] {
  const totals: StageTotal[] = [];
  let cumulativeSupplies = 0;

  for (let stage = 1; stage <= plan.stageCount; stage += 1) {
    const stagePieces = plan.pieces.filter((piece) => piece.stage === stage);
    const supplies = stagePieces.reduce((sum, piece) => sum + getPiece(piece.pieceID).supplies, 0);

    cumulativeSupplies += supplies;

    totals.push({ stage, pieceCount: stagePieces.length, supplies, cumulativeSupplies });
  }

  return totals;
}
