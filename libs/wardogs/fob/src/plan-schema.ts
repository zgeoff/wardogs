import { findPiece } from '@wardogs-love/game-data';
import { z } from 'zod';

const placedPieceSchema = z.strictObject({
  id: z.string().min(1),
  pieceID: z.string().refine((id) => findPiece(id) !== undefined, 'unknown piece'),
  x: z.int(),
  z: z.int(),
  elevation: z.number().nonnegative(),
  rotation: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  stage: z.int().positive(),
});

export const planSchema = z
  .strictObject({
    stageCount: z.int().positive(),
    pieces: z.array(placedPieceSchema),
  })
  .check((context) => {
    const ids = new Set<string>();

    for (const [index, piece] of context.value.pieces.entries()) {
      if (piece.stage > context.value.stageCount) {
        context.issues.push({
          code: 'custom',
          input: piece.stage,
          message: `stage ${piece.stage} is past the plan's ${context.value.stageCount} stages`,
          path: ['pieces', index, 'stage'],
        });
      }

      if (ids.has(piece.id)) {
        context.issues.push({
          code: 'custom',
          input: piece.id,
          message: `the id ${piece.id} appears twice`,
          path: ['pieces', index, 'id'],
        });
      }

      ids.add(piece.id);
    }
  });
