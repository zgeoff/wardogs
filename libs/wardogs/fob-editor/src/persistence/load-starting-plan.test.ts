import { expect, onTestFinished, test } from 'bun:test';
import { encodePlan } from '@wardogs-love/fob';
import { createIndexedDBDocumentStore } from '@wardogs-love/storage';
import { deleteDB } from 'idb';
import { useEditorStore } from '../state/editor-store';
import { loadStartingPlan } from './load-starting-plan';

function setupTest() {
  const databaseName = `plans-${crypto.randomUUID()}`;
  const store = createIndexedDBDocumentStore(databaseName);

  return {
    store,
    async [Symbol.asyncDispose]() {
      await store.close();

      await deleteDB(databaseName);
    },
  };
}

test('it opens the plan edited last', async () => {
  await using context = setupTest();

  await context.store.writeDocument({
    id: 'old',
    tool: 'fob',
    schemaVersion: 1,
    name: 'Old',
    updatedAt: '2026-09-24T10:00:00.000Z',
    data: { stageCount: 1, pieces: [] },
  });

  await context.store.writeDocument({
    id: 'new',
    tool: 'fob',
    schemaVersion: 1,
    name: 'New',
    updatedAt: '2026-09-25T10:00:00.000Z',
    data: { stageCount: 2, pieces: [] },
  });

  await loadStartingPlan(context.store, new AbortController().signal);

  expect(useEditorStore.getState()).toMatchObject({
    documentID: 'new',
    name: 'New',
    plan: { stageCount: 2, pieces: [] },
  });
});

test('it starts a new plan with a FOB when nothing is saved', async () => {
  await using context = setupTest();

  await loadStartingPlan(context.store, new AbortController().signal);

  expect(useEditorStore.getState()).toMatchObject({
    name: 'Untitled FOB',
    plan: { stageCount: 1, pieces: [{ pieceID: 'fob' }] },
  });
});

test('it opens the plan a share link carries', async () => {
  await using context = setupTest();

  const code = await encodePlan({
    stageCount: 3,
    pieces: [{ id: 'a', pieceID: 'gate', x: 4, z: 4, elevation: 0, rotation: 1, stage: 3 }],
  });

  // the test document sits at about:blank, where only the fragment can change
  globalThis.location.hash = `#plan=${code}`;

  onTestFinished(() => {
    globalThis.location.hash = '';
  });

  await loadStartingPlan(context.store, new AbortController().signal);

  expect(useEditorStore.getState()).toMatchObject({
    name: 'Shared plan',
    plan: { stageCount: 3, pieces: [{ pieceID: 'gate', x: 4, z: 4, rotation: 1, stage: 3 }] },
  });
});

test('it leaves a share link in place for the next load when an aborted load reads it', async () => {
  await using context = setupTest();

  const code = await encodePlan({
    stageCount: 2,
    pieces: [{ id: 'a', pieceID: 'gate', x: 2, z: 6, elevation: 0, rotation: 0, stage: 2 }],
  });

  globalThis.location.hash = `#plan=${code}`;

  onTestFinished(() => {
    globalThis.location.hash = '';
  });

  const aborted = new AbortController();

  aborted.abort();

  await loadStartingPlan(context.store, aborted.signal);
  await loadStartingPlan(context.store, new AbortController().signal);

  expect(useEditorStore.getState()).toMatchObject({
    name: 'Shared plan',
    plan: { stageCount: 2, pieces: [{ pieceID: 'gate', x: 2, z: 6, stage: 2 }] },
  });

  expect(globalThis.location.hash).toBe('');
});
