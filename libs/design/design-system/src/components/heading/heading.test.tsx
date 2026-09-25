import { render, screen } from '@testing-library/react';
import { expect, test } from 'bun:test';
import { Heading } from './heading';

test('it renders a heading at the given level', () => {
  render(<Heading level={2}>Stages</Heading>);

  expect(screen.getByRole('heading', { level: 2, name: 'Stages' })).toBeInTheDocument();
});
