import { useEffect, useState } from 'react';
import { loadStartingPlan } from './load-starting-plan';
import { useAutosave } from './use-autosave';
import type { SaveStatus } from './use-autosave';
import { useDocumentStore } from './use-document-store';

export type PersistenceStatus = 'loading' | SaveStatus;

// loads the plan to start from, then keeps the device's copy in step with every edit
export function usePlanPersistence(): PersistenceStatus {
  const store = useDocumentStore();
  const [status, setStatus] = useState<PersistenceStatus>('loading');

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      await loadStartingPlan(store, controller.signal);

      if (!controller.signal.aborted) {
        setStatus('saved');
      }
    })();

    return () => {
      controller.abort();
    };
  }, [store]);

  useAutosave(store, setStatus);

  return status;
}
