import { Button, Dialog } from '@wardogs-love/design-system';
import type { DocumentSummary } from '@wardogs-love/storage';
import { css } from '@wardogs-love/styled-system/css';
import { useEffect, useState } from 'react';
import { FOB_TOOL, parsePlanDocument } from '../persistence/parse-plan-document';
import { useDocumentStore } from '../persistence/use-document-store';
import { useEditorStore } from '../state/editor-store';
import { mutedText } from './panel-styles';

const list = css({ display: 'flex', flexDirection: 'column', gap: '1' });

const row = css({
  alignItems: 'center',
  borderColor: 'border.subtle',
  borderRadius: 'sm',
  borderWidth: '[1px]',
  display: 'flex',
  gap: '2',
  justifyContent: 'space-between',
  padding: '2',
});

const error = css({ color: 'text.danger', fontSize: 'sm' });

interface Props {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' });

export function OpenPlanDialog(props: Props) {
  const store = useDocumentStore();
  const currentID = useEditorStore((state) => state.documentID);
  const [documents, setDocuments] = useState<DocumentSummary[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    void (async () => {
      if (!props.open) {
        return;
      }

      const summaries = await store.readDocuments(FOB_TOOL);

      if (!isCancelled) {
        setDocuments(summaries);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [props.open, store]);

  const handleOpen = async (id: string) => {
    const document = await store.readDocument(id);

    if (document === undefined) {
      setMessage('That plan is gone.');

      return;
    }

    const parsed = parsePlanDocument(document);

    if (!parsed.ok) {
      setMessage(`Cannot open: ${parsed.reason}.`);

      return;
    }

    useEditorStore.getState().loadPlan({ id: document.id, name: document.name, plan: parsed.plan });
    props.onOpenChange(false);
  };

  const handleRemove = async (id: string) => {
    await store.removeDocument(id);

    setDocuments((current) => current?.filter((document) => document.id !== id) ?? null);
  };

  return (
    <Dialog onOpenChange={props.onOpenChange} open={props.open} title="Saved plans">
      {message !== null && <p className={error}>{message}</p>}
      {documents?.length === 0 && <p className={mutedText}>No plans saved on this device yet.</p>}
      <ul className={list}>
        {documents?.map((document) => (
          <li className={row} key={document.id}>
            <span>
              {document.name}
              <br />
              <span className={mutedText}>{dateFormat.format(new Date(document.updatedAt))}</span>
            </span>
            <span>
              <Button
                disabled={document.id === currentID}
                onClick={() => {
                  void handleOpen(document.id);
                }}
                size="sm"
                variant="primary"
              >
                {document.id === currentID ? 'Open now' : 'Open'}
              </Button>{' '}
              <Button
                aria-label={`Delete ${document.name}`}
                disabled={document.id === currentID}
                onClick={() => {
                  void handleRemove(document.id);
                }}
                size="sm"
                variant="danger"
              >
                Delete
              </Button>
            </span>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
