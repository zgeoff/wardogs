import { expect, test } from 'bun:test';
import { useEditorStore } from './editor-store';

test('it places the picked piece at the cell, in the stage on screen', () => {
  useEditorStore
    .getState()
    .loadPlan({ id: 'd', name: 'Plan', plan: { stageCount: 2, pieces: [] } });

  useEditorStore.getState().pickPiece('hesco-small');

  const placed = useEditorStore.getState().placePiece({ x: 4, z: -2 });

  expect(placed).toBeTrue();

  expect(useEditorStore.getState().plan.pieces).toMatchObject([
    { pieceID: 'hesco-small', x: 4, z: -2, elevation: 0, rotation: 0, stage: 2 },
  ]);
});

test('it stacks a piece placed over another on top of it', () => {
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

  useEditorStore.getState().pickPiece('hesco-small');

  const placed = useEditorStore.getState().placePiece({ x: 1, z: 1 });

  expect(placed).toBeTrue();
  expect(useEditorStore.getState().plan.pieces.at(-1)).toMatchObject({ elevation: 1.5 });
});

test('it rests a new piece on the piece under it', () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-large', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
  });

  useEditorStore.getState().pickPiece('hesco-small');

  const ghost = useEditorStore.getState().buildGhost({ x: 1, z: 0 });

  expect(ghost?.elevation).toBe(3);
});

test('it never lowers the ghost below its resting height', () => {
  useEditorStore.getState().pickPiece('hesco-small');
  useEditorStore.getState().liftGhost(-0.75);

  const ghost = useEditorStore.getState().buildGhost({ x: 0, z: 0 });

  expect(ghost?.elevation).toBe(0);
});

test('it lifts the ghost above its resting height', () => {
  useEditorStore.getState().pickPiece('hesco-small');
  useEditorStore.getState().liftGhost(0.75);
  useEditorStore.getState().liftGhost(0.75);

  const ghost = useEditorStore.getState().buildGhost({ x: 0, z: 0 });

  expect(ghost?.elevation).toBe(1.5);
});

test('it builds no ghost while no piece is picked', () => {
  expect(useEditorStore.getState().buildGhost({ x: 0, z: 0 })).toBeNull();
});

test('it turns the ghost a quarter at a time', () => {
  useEditorStore.getState().pickPiece('gate');
  useEditorStore.getState().rotateGhost();
  useEditorStore.getState().rotateGhost();

  expect(useEditorStore.getState().ghostRotation).toBe(2);
});

test('it undoes the last change and redoes it', () => {
  useEditorStore.getState().pickPiece('door');
  useEditorStore.getState().placePiece({ x: 0, z: 0 });
  useEditorStore.getState().placePiece({ x: 4, z: 0 });
  useEditorStore.getState().undo();

  expect(useEditorStore.getState().plan.pieces).toHaveLength(1);

  useEditorStore.getState().redo();

  expect(useEditorStore.getState().plan.pieces).toHaveLength(2);
});

test('it drops the redo history after a new change', () => {
  useEditorStore.getState().pickPiece('door');
  useEditorStore.getState().placePiece({ x: 0, z: 0 });
  useEditorStore.getState().undo();
  useEditorStore.getState().placePiece({ x: 4, z: 0 });

  expect(useEditorStore.getState().future).toStrictEqual([]);
});

test('it refuses to move the selection into another piece', () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'hesco-small', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'hesco-small', x: 2, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
  });

  useEditorStore.getState().selectPieces(['b'], 'replace');

  const moved = useEditorStore.getState().moveSelection({ x: -1, z: 0 }, 0);

  expect(moved).toBeFalse();
  expect(useEditorStore.getState().plan.pieces[1]).toMatchObject({ x: 2 });
});

test('it moves the selection half a module', () => {
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
  useEditorStore.getState().moveSelection({ x: 1, z: 0 }, 0);

  expect(useEditorStore.getState().plan.pieces[0]).toMatchObject({ x: 1, z: 0 });
});

test('it toggles pieces in and out of the selection', () => {
  useEditorStore.getState().selectPieces(['a', 'b'], 'replace');
  useEditorStore.getState().selectPieces(['b', 'c'], 'toggle');

  expect([...useEditorStore.getState().selection]).toStrictEqual(['a', 'c']);
});

test('it removes the selected pieces and clears the selection', () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'door', x: 4, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
  });

  useEditorStore.getState().selectPieces(['a'], 'replace');
  useEditorStore.getState().removeSelection();

  expect(useEditorStore.getState()).toMatchObject({
    plan: { pieces: [{ id: 'b' }] },
    selection: new Set(),
  });
});

test('it shows a new stage once added', () => {
  useEditorStore.getState().addStage();

  expect(useEditorStore.getState()).toMatchObject({ plan: { stageCount: 2 }, viewStage: 2 });
});

test('it deselects pieces that a stage change hides', () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 2,
      pieces: [
        { id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'door', x: 4, z: 0, elevation: 0, rotation: 0, stage: 2 },
      ],
    },
  });

  useEditorStore.getState().selectPieces(['a', 'b'], 'replace');
  useEditorStore.getState().setViewStage(1);

  expect([...useEditorStore.getState().selection]).toStrictEqual(['a']);
});

test('it keeps the view on a stage that still exists after removing the last one', () => {
  useEditorStore
    .getState()
    .loadPlan({ id: 'd', name: 'Plan', plan: { stageCount: 3, pieces: [] } });

  useEditorStore.getState().removeStage(3);

  expect(useEditorStore.getState().viewStage).toBe(2);
});

test('it moves the selection to a later stage and shows that stage', () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 3,
      pieces: [{ id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
    },
  });

  useEditorStore.getState().setViewStage(1);
  useEditorStore.getState().selectPieces(['a'], 'replace');
  useEditorStore.getState().setSelectionStage(3);

  expect(useEditorStore.getState()).toMatchObject({
    plan: { pieces: [{ stage: 3 }] },
    viewStage: 3,
  });
});

test('it starts a loaded plan with no history and nothing to save', () => {
  useEditorStore.getState().pickPiece('door');
  useEditorStore.getState().placePiece({ x: 0, z: 0 });

  useEditorStore
    .getState()
    .loadPlan({ id: 'e', name: 'Other', plan: { stageCount: 1, pieces: [] } });

  expect(useEditorStore.getState()).toMatchObject({
    documentID: 'e',
    past: [],
    future: [],
    revision: 0,
  });
});

test('it counts a rename as an edit to save', () => {
  useEditorStore.getState().renamePlan('North ridge');

  expect(useEditorStore.getState()).toMatchObject({ name: 'North ridge', revision: 1 });
});

test('it selects the pieces inside a box drawn on the ground', () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'door', x: 20, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
  });

  useEditorStore.getState().setPointer({ x: -1, z: -1 });
  useEditorStore.getState().startGesture({ kind: 'box', start: { x: -1, z: -1 }, additive: false });
  useEditorStore.getState().setPointer({ x: 3, z: 3 });
  useEditorStore.getState().endGesture();

  expect([...useEditorStore.getState().selection]).toStrictEqual(['a']);
});

test('it moves the selection by the cells a drag covered', () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 1,
      pieces: [{ id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
    },
  });

  useEditorStore.getState().selectPieces(['a'], 'replace');

  useEditorStore
    .getState()
    .startGesture({ kind: 'drag', start: { x: 0.5, z: 0.5 }, additive: false });

  useEditorStore.getState().setPointer({ x: 2, z: -0.25 });
  useEditorStore.getState().endGesture();

  expect(useEditorStore.getState().plan.pieces[0]).toMatchObject({ x: 2, z: -1 });
});

test('it puts the selected piece on the cursor, turned the same way, to duplicate it', () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 1,
      pieces: [
        { id: 'a', pieceID: 'bremer-wall', x: 0, z: 0, elevation: 0, rotation: 3, stage: 1 },
      ],
    },
  });

  useEditorStore.getState().selectPieces(['a'], 'replace');
  useEditorStore.getState().pickSelectedPiece();

  expect(useEditorStore.getState()).toMatchObject({
    tool: 'place',
    palettePieceID: 'bremer-wall',
    ghostRotation: 3,
    selection: new Set(),
  });
});

test('it duplicates nothing while nothing is selected', () => {
  useEditorStore
    .getState()
    .loadPlan({ id: 'd', name: 'Plan', plan: { stageCount: 1, pieces: [] } });

  expect(useEditorStore.getState().pickSelectedPiece()).toBeFalse();
});

test('it stops placing on a reset', () => {
  useEditorStore.getState().pickPiece('hesco-small');
  useEditorStore.getState().resetTool();

  expect(useEditorStore.getState()).toMatchObject({ tool: 'select', palettePieceID: null });
});

test('it lets go of the selection on a reset with the select tool', () => {
  useEditorStore.getState().cancelTool();
  useEditorStore.getState().selectPieces(['a'], 'replace');
  useEditorStore.getState().resetTool();

  expect(useEditorStore.getState().selection).toStrictEqual(new Set());
});
