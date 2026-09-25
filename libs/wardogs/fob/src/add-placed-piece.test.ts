import { expect, test } from 'bun:test';
import { addPlacedPiece } from './add-placed-piece';

test('it appends the piece to the plan', () => {
  const plan = addPlacedPiece(
    { stageCount: 1, pieces: [] },
    { id: 'a', pieceID: 'gate', x: 4, z: 0, elevation: 0, rotation: 1, stage: 1 },
  );

  expect(plan).toStrictEqual({
    stageCount: 1,
    pieces: [{ id: 'a', pieceID: 'gate', x: 4, z: 0, elevation: 0, rotation: 1, stage: 1 }],
  });
});
