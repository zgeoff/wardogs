import { Button } from './button';

export function Variants() {
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete</Button>
      <Button active>Active</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button>Medium</Button>
      <Button size="sm" square aria-label="Rotate">
        R
      </Button>
    </div>
  );
}
