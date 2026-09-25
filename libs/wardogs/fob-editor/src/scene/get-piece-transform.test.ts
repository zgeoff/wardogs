import { expect, test } from 'bun:test';
import { getPieceTransform } from './get-piece-transform';

test('it centres the mesh on the collision box', () => {
  const transform = getPieceTransform({
    id: 'a',
    pieceID: 'hesco-wall',
    x: 0,
    z: 0,
    elevation: 1.5,
    rotation: 1,
    stage: 1,
  });

  expect(transform).toStrictEqual({
    position: [3, 3.06, 0.75],
    size: [6, 3.12, 1.5],
    rotationY: -Math.PI / 2,
  });
});
