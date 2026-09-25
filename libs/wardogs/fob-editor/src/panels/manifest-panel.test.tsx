import { render, screen } from '@testing-library/react';
import { expect, test } from 'bun:test';
import { useEditorStore } from '../state/editor-store';
import { ManifestPanel } from './manifest-panel';

test('it totals the pieces built by the stage on screen', () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 1,
      pieces: [
        { id: 'f', pieceID: 'fob', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'a', pieceID: 'door', x: 8, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'b', pieceID: 'door', x: 10, z: 0, elevation: 0, rotation: 0, stage: 1 },
      ],
    },
  });

  render(<ManifestPanel />);

  expect(screen.getByRole('row', { name: /Door/u })).toHaveTextContent('Door×238');
  expect(screen.getByRole('row', { name: /Total supplies/u })).toHaveTextContent('68');
});

test('it warns about pieces that stand outside every FOB square', () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 1,
      pieces: [{ id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
    },
  });

  render(<ManifestPanel />);

  expect(screen.getByRole('status')).toHaveTextContent('1 piece needs a FOB square to stand in');
});
