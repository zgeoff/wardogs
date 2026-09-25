import { expect, test } from 'bun:test';
import { removeStage } from './remove-stage';

test('it merges a removed stage into the stage before it', () => {
  const plan = removeStage(
    {
      stageCount: 3,
      pieces: [
        { id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'door', x: 2, z: 0, elevation: 0, rotation: 0, stage: 2 },
        { id: 'c', pieceID: 'door', x: 4, z: 0, elevation: 0, rotation: 0, stage: 3 },
      ],
    },
    2,
  );

  expect(plan.stageCount).toBe(2);
  expect(plan.pieces.map((piece) => piece.stage)).toStrictEqual([1, 1, 2]);
});

test('it merges a removed first stage into the next one', () => {
  const plan = removeStage(
    {
      stageCount: 2,
      pieces: [
        { id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'door', x: 2, z: 0, elevation: 0, rotation: 0, stage: 2 },
      ],
    },
    1,
  );

  expect(plan).toStrictEqual({
    stageCount: 1,
    pieces: [
      { id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
      { id: 'b', pieceID: 'door', x: 2, z: 0, elevation: 0, rotation: 0, stage: 1 },
    ],
  });
});

test('it refuses to remove the only stage', () => {
  expect(() => removeStage({ stageCount: 1, pieces: [] }, 1)).toThrow(RangeError);
});

test('it rejects a stage past the plan', () => {
  expect(() => removeStage({ stageCount: 2, pieces: [] }, 3)).toThrow(RangeError);
});
