import { Button } from '@wardogs-love/design-system';
import { encodePlan } from '@wardogs-love/fob';
import { css } from '@wardogs-love/styled-system/css';
import { useRef, useState } from 'react';
import { buildNewPlan } from '../persistence/build-new-plan';
import { buildPlanDocument } from '../persistence/build-plan-document';
import { readPlanFile } from '../persistence/read-plan-file';
import { writePlanFile } from '../persistence/write-plan-file';
import { useEditorStore } from '../state/editor-store';
import { OpenPlanDialog } from './open-plan-dialog';

const group = css({ alignItems: 'center', display: 'flex', gap: '1' });
const notice = css({ color: 'text.accent', fontSize: 'xs', marginInlineEnd: '2' });

// new, open, export, import, and share: every way a plan enters or leaves the planner
export function FileActions() {
  const [isOpenDialogShown, setIsOpenDialogShown] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleShare = async () => {
    const code = await encodePlan(useEditorStore.getState().plan);

    const location = globalThis.location;
    const url = `${location.origin}${location.pathname}#plan=${code}`;

    try {
      await navigator.clipboard.writeText(url);

      setNotification('Share link copied');
    } catch {
      globalThis.history.replaceState(null, '', url);

      setNotification('Copy failed: the link is in the address bar');
    }
  };

  const handleImport = async (file: File) => {
    const result = await readPlanFile(file);

    if (!result.ok) {
      setNotification(`Import failed: ${result.reason}`);

      return;
    }

    const state = useEditorStore.getState();

    state.loadPlan({ id: crypto.randomUUID(), name: result.name, plan: result.plan });
    state.renamePlan(result.name);

    setNotification(`Imported ${result.name}`);
  };

  return (
    <div className={group}>
      {notification !== null && <output className={notice}>{notification}</output>}
      <Button
        onClick={() => {
          useEditorStore
            .getState()
            .loadPlan({ id: crypto.randomUUID(), name: 'Untitled FOB', plan: buildNewPlan() });
        }}
        size="sm"
      >
        New
      </Button>
      <Button
        onClick={() => {
          setIsOpenDialogShown(true);
        }}
        size="sm"
      >
        Open
      </Button>
      <Button onClick={writeCurrentPlanFile} size="sm">
        Export
      </Button>
      <Button
        onClick={() => {
          fileInput.current?.click();
        }}
        size="sm"
      >
        Import
      </Button>
      <input
        accept=".json,application/json"
        aria-label="Plan file to import"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];

          event.target.value = '';

          if (file !== undefined) {
            void handleImport(file);
          }
        }}
        ref={fileInput}
        type="file"
      />
      <Button
        onClick={() => {
          void handleShare();
        }}
        size="sm"
        variant="primary"
      >
        Share link
      </Button>
      <OpenPlanDialog onOpenChange={setIsOpenDialogShown} open={isOpenDialogShown} />
    </div>
  );
}

function writeCurrentPlanFile() {
  const state = useEditorStore.getState();

  writePlanFile(
    buildPlanDocument({
      id: state.documentID,
      name: state.name,
      plan: state.plan,
      updatedAt: new Date(),
    }),
  );
}
