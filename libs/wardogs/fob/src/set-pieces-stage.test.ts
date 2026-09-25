import { expect, test } from 'bun:test';
import { setPiecesStage } from './set-pieces-stage';

test('it moves the named pieces to the stage', () => {
  const plan = setPiecesStage(
    {
      stageCount: 3,
      pieces: [
        { id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'door', x: 2, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    new Set(['b']),
    3,
  );

  expect(plan.pieces.map((piece) => piece.stage)).toStrictEqual([1, 3]);
});

test('it rejects a stage past the plan', () => {
  expect(() => setPiecesStage({ stageCount: 2, pieces: [] }, new Set(['a']), 3)).toThrow(
    RangeError,
  );
});
