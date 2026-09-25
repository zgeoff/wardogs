import { expect, test } from 'bun:test';
import { buildStamp } from './build-stamp';

test('it places each piece relative to the group’s lowest corner and base', () => {
  expect(
    buildStamp([
      { id: 'a', pieceID: 'hesco-small', x: 4, z: 6, elevation: 1.5, rotation: 0, stage: 2 },
      { id: 'b', pieceID: 'hesco-small', x: 6, z: 6, elevation: 3, rotation: 1, stage: 1 },
    ]),
  ).toStrictEqual([
    { pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0 },
    { pieceID: 'hesco-small', x: 2, z: 0, elevation: 1.5, rotation: 1 },
  ]);
});
