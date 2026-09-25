import { z } from 'zod';

const metres = z.number().positive();

export const pieceSchema = z.strictObject({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/u),
  name: z.string().min(1),
  category: z.enum(['command', 'hesco', 'bunkers', 'barriers', 'recon', 'defences', 'support']),

  // the collision box in metres: width runs along x and depth along z before any rotation
  size: z.strictObject({ width: metres, height: metres, depth: metres }),
  supplies: z.int().nonnegative(),
  hitPoints: z.int().positive(),

  // null for a piece that C4 cannot destroy
  c4ToDestroy: z.int().positive().nullable(),
  needsFOB: z.boolean(),
  source: z.strictObject({
    gameVersion: z.string().min(1),
    reference: z.string().min(1),
    verifiedInGame: z.boolean(),
  }),
});
