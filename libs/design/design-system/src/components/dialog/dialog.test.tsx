import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, mock, test } from 'bun:test';
import { Dialog } from './dialog';

test('it shows its title and content while open', () => {
  render(
    <Dialog onOpenChange={() => {}} open title="Open plan">
      <p>No saved plans</p>
    </Dialog>,
  );

  expect(screen.getByRole('dialog', { name: 'Open plan' })).toHaveTextContent('No saved plans');
});

test('it renders nothing while closed', () => {
  render(
    <Dialog onOpenChange={() => {}} open={false} title="Open plan">
      <p>No saved plans</p>
    </Dialog>,
  );

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('it asks to close when the close button is pressed', async () => {
  const user = userEvent.setup();
  const onOpenChange = mock<(open: boolean) => void>();

  render(
    <Dialog onOpenChange={onOpenChange} open title="Open plan">
      <p>No saved plans</p>
    </Dialog>,
  );

  await user.click(screen.getByRole('button', { name: 'Close' }));

  expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
});
