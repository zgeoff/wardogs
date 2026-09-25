import { z } from 'zod';
import { planSchema } from './plan-schema';
import type { Plan } from './types';

const compactRowSchema = z
  .tuple([z.string(), z.int(), z.int(), z.int(), z.int(), z.int()])
  .readonly();

const compactPlanSchema = z.strictObject({ s: z.int().positive(), p: z.array(compactRowSchema) });

// reverses encodePlan; every piece gets a fresh id, and a malformed code rejects
export async function decodePlan(code: string): Promise<Plan> {
  const [version, payload] = code.split('.');

  if (version !== '1' || payload === undefined) {
    throw new Error('the share code has an unknown version');
  }

  const inflated = await new Response(
    new Blob([Uint8Array.fromBase64(payload, { alphabet: 'base64url' })])
      .stream()
      .pipeThrough(new DecompressionStream('deflate-raw')),
  ).text();

  const compact = compactPlanSchema.parse(JSON.parse(inflated));

  return planSchema.parse({
    stageCount: compact.s,
    pieces: compact.p.map((row) => ({
      id: crypto.randomUUID(),
      pieceID: row[0],
      x: row[1],
      z: row[2],
      elevation: row[3] / 100,
      rotation: row[4],
      stage: row[5],
    })),
  });
}
