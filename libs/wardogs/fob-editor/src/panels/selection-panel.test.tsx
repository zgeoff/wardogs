import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'bun:test';
import { useEditorStore } from '../state/editor-store';
import { SelectionPanel } from './selection-panel';

test('it shows nothing while no piece is selected', () => {
  render(<SelectionPanel />);

  expect(screen.queryByRole('region', { name: 'Selection' })).not.toBeInTheDocument();
});

test('it moves the selection to the stage picked', async () => {
  const user = userEvent.setup();

  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 2,
      pieces: [{ id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
    },
  });

  useEditorStore.getState().selectPieces(['a'], 'replace');

  render(<SelectionPanel />);

  await user.selectOptions(screen.getByRole('combobox', { name: 'Built in stage' }), '2');

  expect(useEditorStore.getState().plan.pieces[0]).toMatchObject({ stage: 2 });
});

test('it deletes the selection', async () => {
  const user = userEvent.setup();

  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 1,
      pieces: [{ id: 'a', pieceID: 'door', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
    },
  });

  useEditorStore.getState().selectPieces(['a'], 'replace');

  render(<SelectionPanel />);

  await user.click(screen.getByRole('button', { name: 'Delete' }));

  expect(useEditorStore.getState().plan.pieces).toStrictEqual([]);
});
