import { expect, test } from 'bun:test';
import { getPiece } from '@wardogs-love/game-data';
import { getFootprint } from './get-footprint';

test('it gives a 1.5 m cube two cells each way', () => {
  expect(getFootprint(getPiece('hesco-small'), 0)).toStrictEqual({ width: 2, depth: 2 });
});

test('it swaps width and depth after a quarter turn', () => {
  expect(getFootprint(getPiece('hesco-wall'), 1)).toStrictEqual({ width: 8, depth: 2 });
});

test('it keeps width and depth after a half turn', () => {
  expect(getFootprint(getPiece('hesco-wall'), 2)).toStrictEqual({ width: 2, depth: 8 });
});

test('it rounds a size between cells up to whole cells', () => {
  expect(getFootprint(getPiece('hedgehog'), 0)).toStrictEqual({ width: 3, depth: 3 });
});

test('it fits a size a hair over whole cells into those cells', () => {
  expect(getFootprint(getPiece('refuel-station'), 0)).toStrictEqual({ width: 4, depth: 4 });
});

test('it gives a sliver of a piece at least one cell', () => {
  expect(getFootprint(getPiece('sandbag-wall'), 0)).toStrictEqual({ width: 4, depth: 1 });
});
