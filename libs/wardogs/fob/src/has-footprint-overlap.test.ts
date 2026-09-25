import { expect, test } from 'bun:test';
import { hasFootprintOverlap } from './has-footprint-overlap';

test('it finds overlap between boxes at different heights over the same ground', () => {
  const result = hasFootprintOverlap(
    { min: { x: 0, y: 0, z: 0 }, max: { x: 1.5, y: 1.5, z: 1.5 } },
    { min: { x: 0.75, y: 9, z: 0 }, max: { x: 2.25, y: 10, z: 1.5 } },
  );

  expect(result).toBeTrue();
});

test('it finds no overlap between boxes side by side', () => {
  const result = hasFootprintOverlap(
    { min: { x: 0, y: 0, z: 0 }, max: { x: 1.5, y: 1.5, z: 1.5 } },
    { min: { x: 1.5, y: 0, z: 0 }, max: { x: 3, y: 1.5, z: 1.5 } },
  );

  expect(result).toBeFalse();
});
