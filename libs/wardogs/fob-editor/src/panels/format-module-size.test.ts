import { expect, test } from 'bun:test';
import { getPiece } from '@wardogs-love/game-data';
import { formatModuleSize } from './format-module-size';

test('it counts a wall in whole modules', () => {
  expect(formatModuleSize(getPiece('hesco-wall'))).toBe('1×4');
});

test('it gives a piece between modules one decimal', () => {
  expect(formatModuleSize(getPiece('hedgehog'))).toBe('1.5×1.5');
});
