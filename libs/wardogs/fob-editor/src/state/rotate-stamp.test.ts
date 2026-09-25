import { expect, test } from 'bun:test';
import { rotateStamp } from './rotate-stamp';

test('it turns a row of pieces into a column, each piece turned with it', () => {
  expect(
    rotateStamp([
      { pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0 },
      { pieceID: 'hesco-small', x: 2, z: 0, elevation: 0, rotation: 0 },
    ]),
  ).toStrictEqual([
    { pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 1 },
    { pieceID: 'hesco-small', x: 0, z: 2, elevation: 0, rotation: 1 },
  ]);
});
