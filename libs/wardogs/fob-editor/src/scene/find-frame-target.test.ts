import { expect, test } from 'bun:test';
import { findFrameTarget } from './find-frame-target';

test('it centres on the first FOB', () => {
  const target = findFrameTarget({
    stageCount: 1,
    pieces: [
      { id: 'a', pieceID: 'hesco-small', x: 40, z: 40, elevation: 0, rotation: 0, stage: 1 },
      { id: 'f', pieceID: 'fob', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
    ],
  });

  expect(target).toStrictEqual({ x: 1.875, z: 1.875 });
});

test('it centres on the first piece of a plan without a FOB', () => {
  const target = findFrameTarget({
    stageCount: 1,
    pieces: [{ id: 'a', pieceID: 'hesco-small', x: 4, z: 0, elevation: 0, rotation: 0, stage: 1 }],
  });

  expect(target).toStrictEqual({ x: 3.75, z: 0.75 });
});

test('it centres on the origin of an empty plan', () => {
  expect(findFrameTarget({ stageCount: 1, pieces: [] })).toStrictEqual({ x: 0, z: 0 });
});
