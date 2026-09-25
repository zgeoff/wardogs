import { expect, test } from 'bun:test';
import { buildStampGhosts } from './build-stamp-ghosts';

test('it settles the group as one unit on the tallest piece under any of it', () => {
  const ghosts = buildStampGhosts({
    plan: {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 2, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
    stamp: [
      { pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0 },
      { pieceID: 'hesco-small', x: 2, z: 0, elevation: 0, rotation: 0 },
    ],
    cell: { x: 0, z: 0 },
    lift: 0,
    stage: 1,
  });

  expect(ghosts.map((ghost) => [ghost.x, ghost.elevation])).toStrictEqual([
    [0, 1.5],
    [2, 1.5],
  ]);
});
