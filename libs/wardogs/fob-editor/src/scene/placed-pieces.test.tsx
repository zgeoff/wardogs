import { expect, onTestFinished, test } from 'bun:test';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useEditorStore } from '../state/editor-store';
import { PlacedPieces } from './placed-pieces';

async function setupTest() {
  const renderer = await ReactThreeTestRenderer.create(<PlacedPieces />);

  onTestFinished(async () => {
    await renderer.unmount();
  });

  return renderer;
}

test('it draws the pieces built by the stage on screen and hides later ones', async () => {
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

  useEditorStore.getState().setViewStage(1);

  const renderer = await setupTest();

  expect(renderer.scene.findAll((node) => node.instance.name.startsWith('piece-'))).toHaveLength(1);
});

test('it sizes each piece’s mesh from its collision box', async () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 1,
      pieces: [{ id: 'a', pieceID: 'hesco-wall', x: 0, z: 0, elevation: 0, rotation: 1, stage: 1 }],
    },
  });

  const renderer = await setupTest();

  const mesh = renderer.scene.find((node) => node.instance.name === 'piece-a');

  expect(mesh.instance.position.toArray()).toStrictEqual([3, 1.56, 0.75]);
});

test('it selects a piece pressed with the select tool', async () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 1,
      pieces: [{ id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
    },
  });

  const renderer = await setupTest();

  await renderer.fireEvent(
    renderer.scene.find((node) => node.instance.name === 'piece-a'),
    'pointerDown',
    {
      button: 0,
      point: { x: 0.5, y: 1, z: 0.5 },
      shiftKey: false,
      stopPropagation: () => {},
    },
  );

  expect([...useEditorStore.getState().selection]).toStrictEqual(['a']);
});
