import { Button, Wordmark } from '@wardogs-love/design-system';
import { css } from '@wardogs-love/styled-system/css';
import type { PersistenceStatus } from '../persistence/use-plan-persistence';
import { useEditorStore } from '../state/editor-store';
import { FileActions } from './file-actions';
import { mutedText } from './panel-styles';

const bar = css({
  alignItems: 'center',
  backgroundColor: 'bg.panel',
  borderBottomColor: 'border',
  borderBottomWidth: '[1px]',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
  paddingBlock: '2',
  paddingInline: '3',
});

const home = css({ marginInlineEnd: '2' });

const nameInput = css({
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  borderRadius: 'sm',
  borderWidth: '[1px]',
  color: 'text.heading',
  fontFamily: 'display',
  fontSize: 'md',
  fontWeight: 'semibold',
  minWidth: '0',
  paddingBlock: '1',
  paddingInline: '2',
  width: '64',
  _hover: { borderColor: 'border' },
  _focus: { borderColor: 'border.accent', outline: 'none' },
});

const group = css({ display: 'flex', gap: '1' });
const spacer = css({ flex: '1' });

const STATUS_LABELS: Readonly<Record<PersistenceStatus, string>> = {
  loading: 'Loading…',
  saved: 'Saved on this device',
  saving: 'Saving…',
  unsaved: 'Unsaved changes',
  failed: 'Could not save',
};

interface Props {
  readonly status: PersistenceStatus;
}

export function TopBar(props: Props) {
  const name = useEditorStore((state) => state.name);
  const canUndo = useEditorStore((state) => state.past.length > 0);
  const canRedo = useEditorStore((state) => state.future.length > 0);
  const cameraMode = useEditorStore((state) => state.cameraMode);

  return (
    <header className={bar}>
      <a aria-label="wardogs home" className={home} href="/">
        <Wordmark />
      </a>
      <input
        aria-label="Plan name"
        className={nameInput}
        onChange={(event) => {
          useEditorStore.getState().renamePlan(event.target.value);
        }}
        value={name}
      />
      <span className={mutedText}>{STATUS_LABELS[props.status]}</span>
      <div className={spacer} />
      <div className={group}>
        <Button
          disabled={!canUndo}
          onClick={() => {
            useEditorStore.getState().undo();
          }}
          size="sm"
          variant="ghost"
        >
          Undo
        </Button>
        <Button
          disabled={!canRedo}
          onClick={() => {
            useEditorStore.getState().redo();
          }}
          size="sm"
          variant="ghost"
        >
          Redo
        </Button>
      </div>
      <div className={group}>
        <Button
          active={cameraMode === 'top'}
          aria-pressed={cameraMode === 'top'}
          onClick={() => {
            useEditorStore.getState().setCameraMode('top');
          }}
          size="sm"
        >
          Top
        </Button>
        <Button
          active={cameraMode === 'orbit'}
          aria-pressed={cameraMode === 'orbit'}
          onClick={() => {
            useEditorStore.getState().setCameraMode('orbit');
          }}
          size="sm"
        >
          3D
        </Button>
      </div>
      <FileActions />
    </header>
  );
}
