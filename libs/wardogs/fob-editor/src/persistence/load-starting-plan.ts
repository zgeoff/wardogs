import { decodePlan } from '@wardogs-love/fob';
import type { Plan } from '@wardogs-love/fob';
import type { DocumentStore } from '@wardogs-love/storage';
import { useEditorStore } from '../state/editor-store';
import type { LoadedPlan } from '../state/types';
import { buildNewPlan } from './build-new-plan';
import { FOB_TOOL, parsePlanDocument } from './parse-plan-document';

// opens a share link's plan if the URL carries one, else the plan edited last, else a new plan
export async function loadStartingPlan(store: DocumentStore): Promise<void> {
  const shared = await tryDecodeSharedPlan();

  if (shared !== null) {
    useEditorStore
      .getState()
      .loadPlan({ id: crypto.randomUUID(), name: 'Shared plan', plan: shared });

    // a shared plan counts as an edit, so it saves as a copy of its own
    useEditorStore.getState().renamePlan('Shared plan');

    return;
  }

  const latest = await readLatestPlan(store);

  useEditorStore
    .getState()
    .loadPlan(latest ?? { id: crypto.randomUUID(), name: 'Untitled FOB', plan: buildNewPlan() });
}

async function readLatestPlan(store: DocumentStore): Promise<LoadedPlan | null> {
  const [latest] = await store.readDocuments(FOB_TOOL);

  if (latest === undefined) {
    return null;
  }

  const document = await store.readDocument(latest.id);

  if (document === undefined) {
    return null;
  }

  const parsed = parsePlanDocument(document);

  return parsed.ok ? { id: document.id, name: document.name, plan: parsed.plan } : null;
}

// a share link carries the plan after `#plan=`; the fragment clears once read, so a reload opens
// the saved copy instead of importing the link again
async function tryDecodeSharedPlan(): Promise<Plan | null> {
  const location = globalThis.location;
  const code = /^#plan=(?<code>.+)$/u.exec(location.hash)?.groups?.['code'];

  if (code === undefined) {
    return null;
  }

  globalThis.history.replaceState(null, '', location.pathname + location.search);

  try {
    return await decodePlan(code);
  } catch {
    return null;
  }
}
