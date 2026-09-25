import { expect, test } from 'bun:test';
import { movePlacedPieces } from './move-placed-pieces';

test('it moves the named pieces by whole cells', () => {
  const plan = movePlacedPieces(
    {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'door', x: 2, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    new Set(['a']),
    { x: 1, z: -3, elevation: 0 },
  );

  expect(plan.pieces).toStrictEqual([
    { id: 'a', pieceID: 'door', x: 1, z: -3, elevation: 0, rotation: 0, stage: 1 },
    { id: 'b', pieceID: 'door', x: 2, z: 0, elevation: 0, rotation: 0, stage: 1 },
  ]);
});

test('it raises a piece without drifting off the centimetre', () => {
  const plan = movePlacedPieces(
    {
      stageCount: 1,
      pieces: [{ id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0.1, rotation: 0, stage: 1 }],
    },
    new Set(['a']),
    { x: 0, z: 0, elevation: 0.2 },
  );

  expect(plan.pieces[0]!.elevation).toBe(0.3);
});

test('it stops a lowered piece at the ground', () => {
  const plan = movePlacedPieces(
    {
      stageCount: 1,
      pieces: [{ id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0.5, rotation: 0, stage: 1 }],
    },
    new Set(['a']),
    { x: 0, z: 0, elevation: -0.75 },
  );

  expect(plan.pieces[0]!.elevation).toBe(0);
});
