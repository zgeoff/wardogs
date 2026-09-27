import { decodePlan } from '@wardogs-love/fob';
import type { Plan } from '@wardogs-love/fob';
import type { DocumentStore } from '@wardogs-love/storage';
import { useEditorStore } from '../state/editor-store';
import type { LoadedPlan } from '../state/types';
import { buildNewPlan } from './build-new-plan';
import { FOB_TOOL, parsePlanDocument } from './parse-plan-document';

// opens a share link's plan if the URL carries one, else the plan edited last, else a new plan; an
// aborted load changes nothing, not even the URL, so React's second dev-mode run still finds the link
export async function loadStartingPlan(store: DocumentStore, signal: AbortSignal): Promise<void> {
  const shared = await tryDecodeSharedPlan();

  if (signal.aborted) {
    return;
  }

  removeShareCode();

  if (shared !== null) {
    setSharedPlan(shared);

    return;
  }

  const latest = await readLatestPlan(store);

  if (!signal.aborted) {
    useEditorStore
      .getState()
      .loadPlan(latest ?? { id: crypto.randomUUID(), name: 'Untitled FOB', plan: buildNewPlan() });
  }
}

// a share link carries the plan after `#plan=`
const SHARE_CODE_PATTERN = /^#plan=(?<code>.+)$/u;

async function tryDecodeSharedPlan(): Promise<Plan | null> {
  const code = SHARE_CODE_PATTERN.exec(globalThis.location.hash)?.groups?.['code'];

  if (code === undefined) {
    return null;
  }

  try {
    return await decodePlan(code);
  } catch {
    return null;
  }
}

// the fragment clears once read, so a reload opens the saved copy instead of importing the link
// again
function removeShareCode(): void {
  const location = globalThis.location;

  if (SHARE_CODE_PATTERN.test(location.hash)) {
    globalThis.history.replaceState(null, '', location.pathname + location.search);
  }
}

// a shared plan counts as an edit, so it saves as a copy of its own
function setSharedPlan(plan: Plan): void {
  useEditorStore.getState().loadPlan({ id: crypto.randomUUID(), name: 'Shared plan', plan });
  useEditorStore.getState().renamePlan('Shared plan');
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
