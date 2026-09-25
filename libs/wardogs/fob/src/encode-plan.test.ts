import { expect, test } from 'bun:test';
import { encodePlan } from './encode-plan';

test('it writes a URL-safe code with a version prefix', async () => {
  const code = await encodePlan({
    stageCount: 2,
    pieces: [
      { id: 'a', pieceID: 'hesco-wall', x: -12, z: 40, elevation: 3.12, rotation: 1, stage: 2 },
    ],
  });

  expect(code).toMatch(/^1\.[\w-]+$/u);
});

test('it writes the same code for the same plan whatever its piece ids', async () => {
  const first = await encodePlan({
    stageCount: 1,
    pieces: [{ id: 'a', pieceID: 'gate', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
  });

  const second = await encodePlan({
    stageCount: 1,
    pieces: [{ id: 'b', pieceID: 'gate', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
  });

  expect(first).toBe(second);
});
