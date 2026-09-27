import { render, screen } from '@testing-library/react';
import { expect, test } from 'bun:test';
import { useEditorStore } from '../state/editor-store';
import { StatusBar } from './status-bar';

test('it hints that a right drag pans in the top view', () => {
  useEditorStore.getState().setCameraMode('top');

  render(<StatusBar />);

  expect(screen.getByText('right drag').parentElement).toHaveTextContent('right drag pan');
});

test('it hints that a right drag orbits and a middle drag pans in the 3D view', () => {
  useEditorStore.getState().setCameraMode('orbit');

  render(<StatusBar />);

  expect(screen.getByText('right drag').parentElement).toHaveTextContent('right drag orbit');
  expect(screen.getByText('middle drag').parentElement).toHaveTextContent('middle drag pan');
});
