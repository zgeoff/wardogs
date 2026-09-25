import { expect, test } from 'bun:test';
import { decodePlan } from './decode-plan';
import { encodePlan } from './encode-plan';

test('it restores an encoded plan with fresh piece ids', async () => {
  const code = await encodePlan({
    stageCount: 2,
    pieces: [
      { id: 'a', pieceID: 'fob', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
      { id: 'b', pieceID: 'hesco-wall', x: -12, z: 40, elevation: 3.12, rotation: 1, stage: 2 },
    ],
  });

  const plan = await decodePlan(code);

  expect(plan).toMatchObject({
    stageCount: 2,
    pieces: [
      { pieceID: 'fob', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
      {
        pieceID: 'hesco-wall',
        x: -12,
        z: 40,
        elevation: 3.12,
        rotation: 1,
        stage: 2,
      },
    ],
  });
});

test('it rejects a code with an unknown version', async () => {
  await expect(
    decodePlan('9.q1YqVrIy0lEqULKKjlZKy09S0jGAQsNYnWiljNTi5Hzd8sScHCUdQwMdXRMdQ1MDHUMdo9jYWgA'),
  ).toReject();
});

test('it rejects a code whose payload is not a deflated plan', async () => {
  await expect(decodePlan('1.bm90LWEtcGxhbg')).toReject();
});

test('it rejects a code that names a piece the catalog lacks', async () => {
  const code = await encodePlan({
    stageCount: 1,
    pieces: [{ id: 'a', pieceID: 'moat', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
  });

  await expect(decodePlan(code)).toReject();
});
