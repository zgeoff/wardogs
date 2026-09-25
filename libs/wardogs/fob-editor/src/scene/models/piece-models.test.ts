import { expect, test } from 'bun:test';
import { pieceCatalog } from '@wardogs-love/game-data';
import { pieceModels } from './piece-models';

test('it has a model for every catalog piece', () => {
  expect(pieceCatalog.filter((piece) => pieceModels[piece.id] === undefined)).toStrictEqual([]);
});
