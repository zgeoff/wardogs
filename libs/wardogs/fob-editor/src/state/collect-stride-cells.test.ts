import { expect, test } from 'bun:test';
import { collectStrideCells } from './collect-stride-cells';

test('it fills the steps between two steps on a line', () => {
  expect(collectStrideCells({ x: 0, z: 0 }, { x: 3, z: 0 })).toStrictEqual([
    { x: 1, z: 0 },
    { x: 2, z: 0 },
    { x: 3, z: 0 },
  ]);
});

test('it steps along a diagonal without a gap', () => {
  expect(collectStrideCells({ x: 0, z: 0 }, { x: 2, z: -2 })).toStrictEqual([
    { x: 1, z: -1 },
    { x: 2, z: -2 },
  ]);
});

test('it collects nothing between a step and itself', () => {
  expect(collectStrideCells({ x: 1, z: 1 }, { x: 1, z: 1 })).toStrictEqual([]);
});
