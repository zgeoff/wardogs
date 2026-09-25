import { expect, test } from 'bun:test';
import { planSchema } from './plan-schema';

test('it accepts a valid plan', () => {
  const result = planSchema.safeParse({
    stageCount: 2,
    pieces: [{ id: 'a', pieceID: 'gate', x: -4, z: 3, elevation: 1.5, rotation: 3, stage: 2 }],
  });

  expect(result.success).toBeTrue();
});

test('it rejects a piece the catalog lacks', () => {
  const result = planSchema.safeParse({
    stageCount: 1,
    pieces: [{ id: 'a', pieceID: 'moat', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
  });

  expect(result.error?.issues).toMatchObject([{ path: ['pieces', 0, 'pieceID'] }]);
});

test('it rejects a position between cells', () => {
  const result = planSchema.safeParse({
    stageCount: 1,
    pieces: [{ id: 'a', pieceID: 'gate', x: 0.5, z: 0, elevation: 0, rotation: 0, stage: 1 }],
  });

  expect(result.error?.issues).toMatchObject([{ path: ['pieces', 0, 'x'] }]);
});

test('it rejects a rotation that is not a quarter turn', () => {
  const result = planSchema.safeParse({
    stageCount: 1,
    pieces: [{ id: 'a', pieceID: 'gate', x: 0, z: 0, elevation: 0, rotation: 4, stage: 1 }],
  });

  expect(result.success).toBeFalse();
});

test('it rejects a piece in a stage past the plan', () => {
  const result = planSchema.safeParse({
    stageCount: 1,
    pieces: [{ id: 'a', pieceID: 'gate', x: 0, z: 0, elevation: 0, rotation: 0, stage: 2 }],
  });

  expect(result.error?.issues).toMatchObject([{ path: ['pieces', 0, 'stage'] }]);
});

test('it rejects two pieces with the same id', () => {
  const result = planSchema.safeParse({
    stageCount: 1,
    pieces: [
      { id: 'a', pieceID: 'gate', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
      { id: 'a', pieceID: 'door', x: 9, z: 0, elevation: 0, rotation: 0, stage: 1 },
    ],
  });

  expect(result.error?.issues).toMatchObject([{ path: ['pieces', 1, 'id'] }]);
});
