import { expect, test } from 'bun:test';
import { useEditorStore } from './editor-store';

test('it pastes a copied group where the stamp lands, as one change', () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'door', x: 2, z: 0, elevation: 0, rotation: 1, stage: 1 },
      ],
    },
  });

  useEditorStore.getState().selectPieces(['a', 'b'], 'replace');
  useEditorStore.getState().setClipboard();
  useEditorStore.getState().pickClipboard();

  const placed = useEditorStore.getState().placeStamp({ x: 10, z: 4 });

  expect({
    placed,
    copies: useEditorStore
      .getState()
      .plan.pieces.slice(2)
      .map((piece) => [piece.pieceID, piece.x, piece.z, piece.rotation]),
    history: useEditorStore.getState().past.length,
  }).toStrictEqual({
    placed: true,
    copies: [
      ['hesco-small', 10, 4, 0],
      ['door', 12, 4, 1],
    ],
    history: 1,
  });
});

test('it stacks a paste over a placed piece on top of it', () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
  });

  useEditorStore.getState().selectPieces(['a'], 'replace');
  useEditorStore.getState().setClipboard();
  useEditorStore.getState().pickClipboard();
  useEditorStore.getState().placeStamp({ x: 0, z: 0 });

  expect(useEditorStore.getState().plan.pieces.map((piece) => piece.elevation)).toStrictEqual([
    0, 1.5,
  ]);
});

test('it pastes nothing before anything is copied', () => {
  expect(useEditorStore.getState().pickClipboard()).toBeFalse();
});
