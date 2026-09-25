import type { DocumentStore } from '@wardogs-love/storage';
import { useEffect } from 'react';
import { useEditorStore } from '../state/editor-store';
import { buildPlanDocument } from './build-plan-document';

const AUTOSAVE_DELAY_MS = 500;

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'failed';

// writes the open plan to the store half a second after the last edit, reporting each step
export function useAutosave(store: DocumentStore, onStatus: (status: SaveStatus) => void): void {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const writeCurrentPlan = async () => {
      const current = useEditorStore.getState();

      onStatus('saving');

      try {
        await store.writeDocument(
          buildPlanDocument({
            id: current.documentID,
            name: current.name,
            plan: current.plan,
            updatedAt: new Date(),
          }),
        );

        onStatus('saved');
      } catch {
        onStatus('failed');
      }
    };

    const unsubscribe = useEditorStore.subscribe((state, previous) => {
      if (state.revision === previous.revision || state.revision === 0) {
        return;
      }

      onStatus('unsaved');

      if (timer !== null) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        void writeCurrentPlan();
      }, AUTOSAVE_DELAY_MS);
    });

    return () => {
      if (timer !== null) {
        clearTimeout(timer);
      }

      unsubscribe();
    };
  }, [store, onStatus]);
}
