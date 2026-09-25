import { expect, test } from 'bun:test';
import { getPiece } from './get-piece';

test('it returns the piece with the id', () => {
  expect(getPiece('gate')).toMatchObject({ id: 'gate', name: 'Gate' });
});

test('it throws for an id the catalog lacks', () => {
  expect(() => getPiece('moat')).toThrowWithMessage(Error, /no piece "moat"/u);
});
