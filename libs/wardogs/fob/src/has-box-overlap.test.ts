import { expect, test } from 'bun:test';
import { hasBoxOverlap } from './has-box-overlap';

test('it finds overlap between boxes that share volume', () => {
  const result = hasBoxOverlap(
    { min: { x: 0, y: 0, z: 0 }, max: { x: 2, y: 2, z: 2 } },
    { min: { x: 1, y: 1, z: 1 }, max: { x: 3, y: 3, z: 3 } },
  );

  expect(result).toBeTrue();
});

test('it finds no overlap between boxes that only touch faces', () => {
  const result = hasBoxOverlap(
    { min: { x: 0, y: 0, z: 0 }, max: { x: 1.5, y: 1.5, z: 1.5 } },
    { min: { x: 1.5, y: 0, z: 0 }, max: { x: 3, y: 1.5, z: 1.5 } },
  );

  expect(result).toBeFalse();
});

test('it ignores a crossing of a few millimetres', () => {
  const result = hasBoxOverlap(
    { min: { x: 0, y: 0, z: 0 }, max: { x: 3.005, y: 1, z: 1 } },
    { min: { x: 3, y: 0, z: 0 }, max: { x: 6, y: 1, z: 1 } },
  );

  expect(result).toBeFalse();
});

test('it finds no overlap between a box and one stacked on top of it', () => {
  const result = hasBoxOverlap(
    { min: { x: 0, y: 0, z: 0 }, max: { x: 1.5, y: 1.5, z: 1.5 } },
    { min: { x: 0, y: 1.5, z: 0 }, max: { x: 1.5, y: 3, z: 1.5 } },
  );

  expect(result).toBeFalse();
});
