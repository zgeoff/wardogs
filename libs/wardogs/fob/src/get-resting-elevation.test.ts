import { expect, test } from 'bun:test';
import { getRestingElevation } from './get-resting-elevation';

test('it rests a piece on the ground when nothing is under it', () => {
  const elevation = getRestingElevation(
    { stageCount: 1, pieces: [] },
    { id: 'b', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
  );

  expect(elevation).toBe(0);
});

test('it rests a piece on top of the piece under it', () => {
  const elevation = getRestingElevation(
    {
      stageCount: 1,
      pieces: [{ id: 'a', pieceID: 'hesco-wall', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
    },
    { id: 'b', pieceID: 'hesco-small', x: 0, z: 2, elevation: 0, rotation: 0, stage: 1 },
  );

  expect(elevation).toBe(3.12);
});

test('it rests a piece spanning two stacks on the taller one', () => {
  const elevation = getRestingElevation(
    {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'hesco-large', x: 2, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    { id: 'c', pieceID: 'hesco-wall', x: 1, z: 0, elevation: 0, rotation: 1, stage: 1 },
  );

  expect(elevation).toBe(3);
});

test('it ignores a piece beside the footprint', () => {
  const elevation = getRestingElevation(
    {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-large', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    { id: 'b', pieceID: 'hesco-small', x: 2, z: 0, elevation: 0, rotation: 0, stage: 1 },
  );

  expect(elevation).toBe(0);
});

test('it ignores the pieces moving with the candidate', () => {
  const elevation = getRestingElevation(
    {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-large', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    { id: 'b', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
    new Set(['a']),
  );

  expect(elevation).toBe(0);
});
