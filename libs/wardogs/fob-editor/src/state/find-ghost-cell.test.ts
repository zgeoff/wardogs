import { expect, test } from 'bun:test';
import { findGhostCell } from './find-ghost-cell';

test('it centres a two-cell piece on the pointer', () => {
  expect(findGhostCell('hesco-small', 0, { x: 0.8, z: -0.7 })).toStrictEqual({ x: 0, z: -2 });
});

test('it centres a turned wall along x', () => {
  expect(findGhostCell('hesco-wall', 1, { x: 3, z: 0.75 })).toStrictEqual({ x: 0, z: 0 });
});

test('it finds no cell while the pointer is off the scene', () => {
  expect(findGhostCell('hesco-small', 0, null)).toBeNull();
});

test('it finds no cell while no piece is picked', () => {
  expect(findGhostCell(null, 0, { x: 0, z: 0 })).toBeNull();
});
