import { expect, test } from 'bun:test';
import { removePlacedPieces } from './remove-placed-pieces';

test('it removes only the named pieces', () => {
  const plan = removePlacedPieces(
    {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'door', x: 2, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    new Set(['a']),
  );

  expect(plan.pieces.map((piece) => piece.id)).toStrictEqual(['b']);
});
