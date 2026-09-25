import { expect, test } from 'bun:test';
import { useEditorStore } from './editor-store';

test('it places a copy on each footprint the drag passes, as one change', () => {
  useEditorStore
    .getState()
    .loadPlan({ id: 'd', name: 'Plan', plan: { stageCount: 1, pieces: [] } });

  useEditorStore.getState().pickPiece('hesco-small');
  useEditorStore.getState().startPaint({ x: 0.75, z: 0.75 });
  useEditorStore.getState().updatePaint({ x: 3.75, z: 0.75 }, false);

  const placedCount = useEditorStore.getState().endPaint();

  expect({
    placedCount,
    cells: useEditorStore.getState().plan.pieces.map((piece) => [piece.x, piece.z]),
    history: useEditorStore.getState().past,
  }).toMatchObject({
    placedCount: 3,
    cells: [
      [0, 0],
      [2, 0],
      [4, 0],
    ],
    history: [{ pieces: [] }],
  });
});

test('it holds the stroke to a straight line along the longer axis with Shift', () => {
  useEditorStore
    .getState()
    .loadPlan({ id: 'd', name: 'Plan', plan: { stageCount: 1, pieces: [] } });

  useEditorStore.getState().pickPiece('hesco-small');
  useEditorStore.getState().startPaint({ x: 0.75, z: 0.75 });
  useEditorStore.getState().updatePaint({ x: 3.75, z: 2.25 }, true);

  expect(useEditorStore.getState().paint?.cells).toStrictEqual([
    { x: 0, z: 0 },
    { x: 2, z: 0 },
    { x: 4, z: 0 },
  ]);
});

test('it stacks a copy painted over a placed piece on top of it', () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 2, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
  });

  useEditorStore.getState().pickPiece('hesco-small');
  useEditorStore.getState().startPaint({ x: 0.75, z: 0.75 });
  useEditorStore.getState().updatePaint({ x: 2.25, z: 0.75 }, false);
  useEditorStore.getState().endPaint();

  expect(
    useEditorStore.getState().plan.pieces.map((piece) => [piece.x, piece.elevation]),
  ).toStrictEqual([
    [2, 0],
    [0, 0],
    [2, 1.5],
  ]);
});

test('it drops a stroke in progress on a reset and keeps the piece picked', () => {
  useEditorStore
    .getState()
    .loadPlan({ id: 'd', name: 'Plan', plan: { stageCount: 1, pieces: [] } });

  useEditorStore.getState().pickPiece('hesco-small');
  useEditorStore.getState().startPaint({ x: 0.75, z: 0.75 });
  useEditorStore.getState().resetTool();

  expect({
    paint: useEditorStore.getState().paint,
    tool: useEditorStore.getState().tool,
    placed: useEditorStore.getState().endPaint(),
  }).toStrictEqual({ paint: null, tool: 'place', placed: 0 });
});
