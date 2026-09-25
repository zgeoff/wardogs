import { expect, test } from 'bun:test';
import { buildDragOffset } from './build-drag-offset';

test('it rounds the drag to whole cells', () => {
  expect(buildDragOffset({ x: 0, z: 0 }, { x: 1.2, z: -0.8 })).toStrictEqual({ x: 2, z: -1 });
});

test('it reports no offset for a drag shorter than half a cell', () => {
  expect(buildDragOffset({ x: 5, z: 5 }, { x: 5.3, z: 4.7 })).toStrictEqual({ x: 0, z: 0 });
});
