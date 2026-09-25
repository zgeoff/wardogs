import { expect, test } from 'bun:test';
import { isOutsideFOBArea } from './is-outside-fob-area';

test('it flags a piece that needs a FOB when the plan has none', () => {
  const result = isOutsideFOBArea(
    { stageCount: 1, pieces: [] },
    { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
  );

  expect(result).toBeTrue();
});

test('it never flags a piece that can stand anywhere', () => {
  const result = isOutsideFOBArea(
    { stageCount: 1, pieces: [] },
    { id: 'a', pieceID: 'sandbag-wall', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
  );

  expect(result).toBeFalse();
});

test('it accepts a piece inside the FOB square', () => {
  const result = isOutsideFOBArea(
    {
      stageCount: 1,
      pieces: [{ id: 'f', pieceID: 'fob', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
    },
    { id: 'a', pieceID: 'hesco-small', x: 60, z: -60, elevation: 0, rotation: 0, stage: 1 },
  );

  expect(result).toBeFalse();
});

test('it flags a piece that crosses the edge of the FOB square', () => {
  const result = isOutsideFOBArea(
    {
      stageCount: 1,
      pieces: [{ id: 'f', pieceID: 'fob', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
    },
    { id: 'a', pieceID: 'hesco-small', x: 82, z: 0, elevation: 0, rotation: 0, stage: 1 },
  );

  expect(result).toBeTrue();
});

test('it accepts a piece inside the square of a second FOB', () => {
  const result = isOutsideFOBArea(
    {
      stageCount: 1,
      pieces: [
        { id: 'f', pieceID: 'fob', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'g', pieceID: 'fob', x: 200, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    { id: 'a', pieceID: 'hesco-small', x: 200, z: 0, elevation: 0, rotation: 0, stage: 1 },
  );

  expect(result).toBeFalse();
});
