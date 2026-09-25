import { expect, test } from 'bun:test';
import { pieceCatalog } from './piece-catalog';
import { pieceSchema } from './piece-schema';

test('it holds only entries that satisfy the piece schema', () => {
  const failures = pieceCatalog.filter((piece) => !pieceSchema.safeParse(piece).success);

  expect(failures).toStrictEqual([]);
});

test('it gives every piece a unique id', () => {
  const ids = pieceCatalog.map((piece) => piece.id);

  expect(new Set(ids).size).toBe(ids.length);
});

test('it includes exactly one command piece, the FOB', () => {
  const commandPieces = pieceCatalog.filter((piece) => piece.category === 'command');

  expect(commandPieces.map((piece) => piece.id)).toStrictEqual(['fob']);
});
