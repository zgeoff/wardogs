import { expect, test } from 'bun:test';
import { buildPieceBox } from './build-piece-box';

test('it places a cube from its corner cell in metres', () => {
  const box = buildPieceBox({
    id: 'a',
    pieceID: 'hesco-small',
    x: 2,
    z: -2,
    elevation: 0,
    rotation: 0,
    stage: 1,
  });

  expect(box).toStrictEqual({
    min: { x: 1.5, y: 0, z: -1.5 },
    max: { x: 3, y: 1.5, z: 0 },
  });
});

test('it lifts the box by the elevation', () => {
  const box = buildPieceBox({
    id: 'a',
    pieceID: 'hesco-small',
    x: 0,
    z: 0,
    elevation: 3,
    rotation: 0,
    stage: 1,
  });

  expect(box.min.y).toBe(3);
  expect(box.max.y).toBe(4.5);
});

test('it lays a quarter-turned wall along x', () => {
  const box = buildPieceBox({
    id: 'a',
    pieceID: 'hesco-wall',
    x: 0,
    z: 0,
    elevation: 0,
    rotation: 1,
    stage: 1,
  });

  expect(box).toStrictEqual({
    min: { x: 0, y: 0, z: 0 },
    max: { x: 6, y: 3.12, z: 1.5 },
  });
});

test('it centres a piece narrower than its cells', () => {
  const box = buildPieceBox({
    id: 'a',
    pieceID: 'hedgehog',
    x: 0,
    z: 0,
    elevation: 0,
    rotation: 0,
    stage: 1,
  });

  expect(box.min.x).toBeCloseTo(0.025);
  expect(box.max.x).toBeCloseTo(2.225);
});
