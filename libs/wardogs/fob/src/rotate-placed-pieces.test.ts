import { expect, test } from 'bun:test';
import { rotatePlacedPieces } from './rotate-placed-pieces';
import type { Plan } from './types';

test('it turns a single wall about its own centre', () => {
  const plan = rotatePlacedPieces(
    {
      stageCount: 1,
      pieces: [{ id: 'a', pieceID: 'hesco-wall', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
    },
    new Set(['a']),
  );

  expect(plan.pieces).toStrictEqual([
    { id: 'a', pieceID: 'hesco-wall', x: -3, z: 3, elevation: 0, rotation: 1, stage: 1 },
  ]);
});

test('it swings a group about the group centre, clockwise from above', () => {
  const plan = rotatePlacedPieces(
    {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'hesco-small', x: 2, z: 0, elevation: 1.5, rotation: 0, stage: 1 },
      ],
    },
    new Set(['a', 'b']),
  );

  expect(plan.pieces).toStrictEqual([
    { id: 'a', pieceID: 'hesco-small', x: 1, z: -1, elevation: 0, rotation: 1, stage: 1 },
    { id: 'b', pieceID: 'hesco-small', x: 1, z: 1, elevation: 1.5, rotation: 1, stage: 1 },
  ]);
});

test('it returns a piece to its start after four turns', () => {
  const start: Plan = {
    stageCount: 1,
    pieces: [{ id: 'a', pieceID: 'hesco-wall', x: 5, z: 7, elevation: 0, rotation: 3, stage: 1 }],
  };

  const ids = new Set(['a']);

  const plan = [1, 2, 3, 4].reduce((current) => rotatePlacedPieces(current, ids), start);

  expect(plan).toStrictEqual(start);
});

test('it leaves the plan alone when no piece is named', () => {
  const start = {
    stageCount: 1,
    pieces: [
      { id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 } as const,
    ],
  };

  expect(rotatePlacedPieces(start, new Set())).toBe(start);
});
