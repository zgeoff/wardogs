import { expect, test } from 'bun:test';
import { collectPiecesInBox } from './collect-pieces-in-box';

test('it collects the pieces the rectangle touches, whichever way it was drawn', () => {
  const ids = collectPiecesInBox(
    {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'hesco-small', x: 10, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    1,
    { corner: { x: 2, z: 2 }, opposite: { x: 1, z: 1 } },
  );

  expect(ids).toStrictEqual(['a']);
});

test('it skips pieces of stages after the one on screen', () => {
  const ids = collectPiecesInBox(
    {
      stageCount: 2,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 2 },
      ],
    },
    1,
    { corner: { x: -5, z: -5 }, opposite: { x: 5, z: 5 } },
  );

  expect(ids).toStrictEqual([]);
});
