import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, mock, test } from 'bun:test';
import { Button } from './button';

test('it renders a button that does not submit forms by default', () => {
  render(<Button>Place</Button>);

  expect(screen.getByRole('button', { name: 'Place' })).toHaveAttribute('type', 'button');
});

test('it reports a click', async () => {
  const user = userEvent.setup();
  const onClick = mock<() => void>();

  render(<Button onClick={onClick}>Place</Button>);

  await user.click(screen.getByRole('button', { name: 'Place' }));

  expect(onClick).toHaveBeenCalledOnce();
});

test('it ignores a click while disabled', async () => {
  const user = userEvent.setup();
  const onClick = mock<() => void>();

  render(
    <Button disabled onClick={onClick}>
      Place
    </Button>,
  );

  await user.click(screen.getByRole('button', { name: 'Place' }));

  expect(onClick).not.toHaveBeenCalled();
});

test('it keeps a class name the caller passes', () => {
  render(<Button className="extra">Place</Button>);

  expect(screen.getByRole('button', { name: 'Place' })).toHaveClass('extra');
});
