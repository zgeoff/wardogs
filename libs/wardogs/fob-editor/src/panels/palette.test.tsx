import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'bun:test';
import { useEditorStore } from '../state/editor-store';
import { Palette } from './palette';

test('it picks a piece for placing when its button is pressed', async () => {
  const user = userEvent.setup();

  render(<Palette />);

  await user.click(screen.getByRole('button', { name: /Hesco Wall/u }));

  expect(useEditorStore.getState()).toMatchObject({ tool: 'place', palettePieceID: 'hesco-wall' });
});

test('it marks the picked piece as pressed', () => {
  useEditorStore.getState().pickPiece('gate');

  render(<Palette />);

  expect(screen.getByRole('button', { name: /^Gate/u })).toHaveAttribute('aria-pressed', 'true');
});

test('it lists each piece with its size in modules and its supply cost', () => {
  render(<Palette />);

  expect(screen.getByRole('button', { name: /Hesco Wall/u })).toHaveTextContent('Hesco Wall 1×461');
});
