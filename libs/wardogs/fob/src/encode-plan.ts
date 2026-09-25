import type { Plan } from './types';

const SHARE_CODE_VERSION = '1';

// a plan in its URL-safe share form: a version prefix, then compact rows, deflated and base64url
// encoded; elevations travel in whole centimetres
export async function encodePlan(plan: Plan): Promise<string> {
  const compact = {
    s: plan.stageCount,
    p: plan.pieces.map((piece) => [
      piece.pieceID,
      piece.x,
      piece.z,
      Math.round(piece.elevation * 100),
      piece.rotation,
      piece.stage,
    ]),
  };

  const bytes = new TextEncoder().encode(JSON.stringify(compact));

  const deflated = await new Response(
    new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw')),
  ).bytes();

  return `${SHARE_CODE_VERSION}.${deflated.toBase64({ alphabet: 'base64url', omitPadding: true })}`;
}
