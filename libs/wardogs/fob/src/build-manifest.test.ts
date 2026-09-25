import { expect, test } from 'bun:test';
import { buildManifest } from './build-manifest';

test('it counts the pieces built by the end of the stage, in catalog order', () => {
  const manifest = buildManifest(
    {
      stageCount: 2,
      pieces: [
        { id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'hesco-small', x: 2, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'c', pieceID: 'hesco-small', x: 4, z: 0, elevation: 0, rotation: 0, stage: 2 },
        { id: 'd', pieceID: 'drill-rig', x: 9, z: 0, elevation: 0, rotation: 0, stage: 2 },
      ],
    },
    2,
  );

  expect(manifest).toStrictEqual([
    { pieceID: 'hesco-small', count: 2, supplies: 26 },
    { pieceID: 'door', count: 1, supplies: 19 },
    { pieceID: 'drill-rig', count: 1, supplies: 1801 },
  ]);
});

test('it leaves out the pieces of later stages', () => {
  const manifest = buildManifest(
    {
      stageCount: 2,
      pieces: [
        { id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'gate', x: 2, z: 0, elevation: 0, rotation: 0, stage: 2 },
      ],
    },
    1,
  );

  expect(manifest).toStrictEqual([{ pieceID: 'door', count: 1, supplies: 19 }]);
});
