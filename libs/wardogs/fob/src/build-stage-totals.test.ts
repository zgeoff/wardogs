import { expect, test } from 'bun:test';
import { buildStageTotals } from './build-stage-totals';

test('it totals the supplies of each stage and the running sum', () => {
  const totals = buildStageTotals({
    stageCount: 3,
    pieces: [
      { id: 'f', pieceID: 'fob', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
      { id: 'a', pieceID: 'hesco-wall', x: 8, z: 0, elevation: 0, rotation: 0, stage: 1 },
      { id: 'b', pieceID: 'gate', x: 10, z: 0, elevation: 0, rotation: 0, stage: 3 },
    ],
  });

  expect(totals).toStrictEqual([
    { stage: 1, pieceCount: 2, supplies: 91, cumulativeSupplies: 91 },
    { stage: 2, pieceCount: 0, supplies: 0, cumulativeSupplies: 91 },
    { stage: 3, pieceCount: 1, supplies: 69, cumulativeSupplies: 160 },
  ]);
});
