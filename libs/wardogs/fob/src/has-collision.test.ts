import { expect, test } from 'bun:test';
import { hasCollision } from './has-collision';

test('it finds a named piece that intersects another piece', () => {
  const result = hasCollision(
    {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'hesco-small', x: 1, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    new Set(['b']),
  );

  expect(result).toBeTrue();
});

test('it ignores intersections inside the named group', () => {
  const result = hasCollision(
    {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'hesco-small', x: 1, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    new Set(['a', 'b']),
  );

  expect(result).toBeFalse();
});

test('it finds nothing when the named pieces stand clear', () => {
  const result = hasCollision(
    {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'hesco-small', x: 2, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    new Set(['b']),
  );

  expect(result).toBeFalse();
});
