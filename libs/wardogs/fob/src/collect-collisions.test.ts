import { expect, test } from 'bun:test';
import { collectCollisions } from './collect-collisions';

test('it reports a piece that the candidate would pass through', () => {
  const collisions = collectCollisions(
    {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    { id: 'b', pieceID: 'hesco-small', x: 1, z: 0, elevation: 0, rotation: 0, stage: 1 },
  );

  expect(collisions.map((piece) => piece.id)).toStrictEqual(['a']);
});

test('it allows a half-module offset that only touches a neighbour', () => {
  const collisions = collectCollisions(
    {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    { id: 'b', pieceID: 'hesco-small', x: 2, z: 1, elevation: 0, rotation: 0, stage: 1 },
  );

  expect(collisions).toStrictEqual([]);
});

test('it allows a piece resting on top of another', () => {
  const collisions = collectCollisions(
    {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    { id: 'b', pieceID: 'hesco-small', x: 1, z: 1, elevation: 1.5, rotation: 0, stage: 1 },
  );

  expect(collisions).toStrictEqual([]);
});

test('it never reports the candidate against its own earlier position', () => {
  const collisions = collectCollisions(
    {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    { id: 'a', pieceID: 'hesco-small', x: 1, z: 0, elevation: 0, rotation: 0, stage: 1 },
  );

  expect(collisions).toStrictEqual([]);
});

test('it skips the pieces moving with the candidate', () => {
  const collisions = collectCollisions(
    {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    { id: 'b', pieceID: 'hesco-small', x: 1, z: 0, elevation: 0, rotation: 0, stage: 1 },
    new Set(['a']),
  );

  expect(collisions).toStrictEqual([]);
});
