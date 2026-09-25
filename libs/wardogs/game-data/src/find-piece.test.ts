import { expect, test } from 'bun:test';
import { findPiece } from './find-piece';

test('it finds a piece by its id', () => {
  expect(findPiece('hesco-wall')).toMatchObject({
    name: 'Hesco Wall',
    size: { width: 1.5, height: 3.12, depth: 6 },
  });
});

test('it returns undefined for an unknown id', () => {
  expect(findPiece('moat')).toBeUndefined();
});
