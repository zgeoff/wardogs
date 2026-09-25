import type { z } from 'zod';
import type { pieceSchema } from './piece-schema';

export type Piece = z.infer<typeof pieceSchema>;

export type PieceCategory = Piece['category'];
