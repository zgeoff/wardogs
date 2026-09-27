import { expect, test } from 'bun:test';
import { findGroundPoint } from './find-ground-point';

test('it finds where a slanted ray meets the ground', () => {
  const point = findGroundPoint({
    origin: { x: 0, y: 10, z: 0 },
    direction: { x: 0.6, y: -0.8, z: 0 },
  });

  expect(point).toStrictEqual({ x: 7.5, z: 0 });
});

test('it finds nothing for a ray that points up', () => {
  const point = findGroundPoint({
    origin: { x: 0, y: 10, z: 0 },
    direction: { x: 0, y: 1, z: 0 },
  });

  expect(point).toBeNull();
});

test('it finds nothing for a ray that starts below the ground and points down', () => {
  const point = findGroundPoint({
    origin: { x: 0, y: -1, z: 0 },
    direction: { x: 0, y: -1, z: 0 },
  });

  expect(point).toBeNull();
});
