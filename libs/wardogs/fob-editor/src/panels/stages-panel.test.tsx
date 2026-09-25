import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'bun:test';
import { useEditorStore } from '../state/editor-store';
import { StagesPanel } from './stages-panel';

test('it shows each stage’s supplies and the running total', () => {
  useEditorStore.getState().loadPlan({
    id: 'd',
    name: 'Plan',
    plan: {
      stageCount: 2,
      pieces: [
        { id: 'f', pieceID: 'fob', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 },
        { id: 'g', pieceID: 'gate', x: 8, z: 0, elevation: 0, rotation: 0, stage: 2 },
      ],
    },
  });

  render(<StagesPanel />);

  expect(screen.getByRole('button', { name: /Stage 2/u })).toHaveTextContent(
    'Stage 2 · 1 pieces+6999',
  );
});

test('it shows a stage when its row is pressed', async () => {
  const user = userEvent.setup();

  useEditorStore
    .getState()
    .loadPlan({ id: 'd', name: 'Plan', plan: { stageCount: 3, pieces: [] } });

  render(<StagesPanel />);

  await user.click(screen.getByRole('button', { name: /Stage 1/u }));

  expect(useEditorStore.getState().viewStage).toBe(1);
});

test('it adds a stage', async () => {
  const user = userEvent.setup();

  render(<StagesPanel />);

  await user.click(screen.getByRole('button', { name: 'Add stage' }));

  expect(screen.getByRole('button', { name: /Stage 2/u })).toHaveAttribute('aria-pressed', 'true');
});

test('it keeps the last stage from being removed', () => {
  render(<StagesPanel />);

  expect(screen.getByRole('button', { name: 'Remove stage 1' })).toBeDisabled();
});
