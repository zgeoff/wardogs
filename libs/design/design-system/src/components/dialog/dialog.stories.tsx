import { useState } from 'react';
import { Button } from '../button/button';
import { Dialog } from './dialog';

export function Default() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open
      </Button>
      <Dialog onOpenChange={setOpen} open={open} title="Open plan">
        <p>No saved plans yet.</p>
      </Dialog>
    </>
  );
}
