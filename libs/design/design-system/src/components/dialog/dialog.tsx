import { Dialog as ArkDialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { sva } from '@wardogs-love/styled-system/css';
import type { ReactNode } from 'react';
import { Button } from '../button/button';
import { Heading } from '../heading/heading';

const dialog = sva({
  slots: ['backdrop', 'positioner', 'content', 'header'],
  base: {
    backdrop: {
      backgroundColor: '[rgba(0, 0, 0, 0.6)]',
      inset: '0',
      position: 'fixed',
      zIndex: 'overlay',
    },
    positioner: {
      alignItems: 'center',
      display: 'flex',
      inset: '0',
      justifyContent: 'center',
      padding: '4',
      position: 'fixed',
      zIndex: 'modal',
    },
    content: {
      backgroundColor: 'bg.panel',
      borderColor: 'border.strong',
      borderRadius: 'md',
      borderWidth: '[1px]',
      display: 'flex',
      flexDirection: 'column',
      gap: '4',
      maxHeight: '[85vh]',
      maxWidth: 'lg',
      overflowY: 'auto',
      padding: '5',
      width: 'full',
    },
    header: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
});

interface Props {
  readonly open: boolean;
  readonly title: string;
  readonly children: ReactNode;
  readonly onOpenChange: (open: boolean) => void;
}

export function Dialog(props: Props) {
  const styles = dialog();

  return (
    <ArkDialog.Root
      lazyMount
      onOpenChange={(details) => {
        props.onOpenChange(details.open);
      }}
      open={props.open}
      unmountOnExit
    >
      <Portal>
        <ArkDialog.Backdrop className={styles.backdrop} />
        <ArkDialog.Positioner className={styles.positioner}>
          <ArkDialog.Content className={styles.content}>
            <div className={styles.header}>
              <ArkDialog.Title asChild>
                <Heading level={2}>{props.title}</Heading>
              </ArkDialog.Title>
              <ArkDialog.CloseTrigger asChild>
                <Button size="sm" variant="ghost">
                  Close
                </Button>
              </ArkDialog.CloseTrigger>
            </div>
            {props.children}
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    </ArkDialog.Root>
  );
}
