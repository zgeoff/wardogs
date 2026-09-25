import { pieceCatalog } from '@wardogs-love/game-data';
import type { Plan } from './types';

export interface ManifestLine {
  readonly pieceID: string;
  readonly count: number;
  readonly supplies: number;
}

// every piece built by the end of `stage`, counted by type in catalog order
export function buildManifest(plan: Plan, stage: number): ManifestLine[] {
  const builtPieces = plan.pieces.filter((piece) => piece.stage <= stage);

  return pieceCatalog.flatMap((catalogPiece) => {
    const count = builtPieces.filter((piece) => piece.pieceID === catalogPiece.id).length;

    return count === 0
      ? []
      : [{ pieceID: catalogPiece.id, count, supplies: count * catalogPiece.supplies }];
  });
}
