import { expect, test } from 'bun:test';
import { deleteDB } from 'idb';
import { createIndexedDBDocumentStore } from './create-indexeddb-document-store';

function setupTest() {
  const databaseName = `documents-${crypto.randomUUID()}`;
  const store = createIndexedDBDocumentStore(databaseName);

  return {
    store,
    async [Symbol.asyncDispose]() {
      await store.close();

      await deleteDB(databaseName);
    },
  };
}

test('it reads back a written document', async () => {
  await using context = setupTest();

  await context.store.writeDocument({
    id: 'a',
    tool: 'fob',
    schemaVersion: 1,
    name: 'North gate',
    updatedAt: '2026-09-25T10:00:00.000Z',
    data: { stageCount: 1, pieces: [] },
  });

  const document = await context.store.readDocument('a');

  expect(document).toStrictEqual({
    id: 'a',
    tool: 'fob',
    schemaVersion: 1,
    name: 'North gate',
    updatedAt: '2026-09-25T10:00:00.000Z',
    data: { stageCount: 1, pieces: [] },
  });
});

test('it reads undefined for an id it never stored', async () => {
  await using context = setupTest();

  const document = await context.store.readDocument('missing');

  expect(document).toBeUndefined();
});

test('it replaces a document written again under the same id', async () => {
  await using context = setupTest();

  await context.store.writeDocument({
    id: 'a',
    tool: 'fob',
    schemaVersion: 1,
    name: 'Draft',
    updatedAt: '2026-09-25T10:00:00.000Z',
    data: null,
  });

  await context.store.writeDocument({
    id: 'a',
    tool: 'fob',
    schemaVersion: 1,
    name: 'Final',
    updatedAt: '2026-09-25T11:00:00.000Z',
    data: null,
  });

  const document = await context.store.readDocument('a');

  expect(document?.name).toBe('Final');
});

test('it lists one tool’s documents without their data, newest first', async () => {
  await using context = setupTest();

  await context.store.writeDocument({
    id: 'old',
    tool: 'fob',
    schemaVersion: 1,
    name: 'Old',
    updatedAt: '2026-09-24T10:00:00.000Z',
    data: { big: true },
  });

  await context.store.writeDocument({
    id: 'new',
    tool: 'fob',
    schemaVersion: 1,
    name: 'New',
    updatedAt: '2026-09-25T10:00:00.000Z',
    data: { big: true },
  });

  await context.store.writeDocument({
    id: 'other',
    tool: 'loadout',
    schemaVersion: 1,
    name: 'Other tool',
    updatedAt: '2026-09-25T12:00:00.000Z',
    data: null,
  });

  const summaries = await context.store.readDocuments('fob');

  expect(summaries).toStrictEqual([
    {
      id: 'new',
      tool: 'fob',
      schemaVersion: 1,
      name: 'New',
      updatedAt: '2026-09-25T10:00:00.000Z',
    },
    {
      id: 'old',
      tool: 'fob',
      schemaVersion: 1,
      name: 'Old',
      updatedAt: '2026-09-24T10:00:00.000Z',
    },
  ]);
});

test('it forgets a removed document', async () => {
  await using context = setupTest();

  await context.store.writeDocument({
    id: 'a',
    tool: 'fob',
    schemaVersion: 1,
    name: 'Gone',
    updatedAt: '2026-09-25T10:00:00.000Z',
    data: null,
  });

  await context.store.removeDocument('a');

  const document = await context.store.readDocument('a');

  expect(document).toBeUndefined();
});

test('it reopens after being closed', async () => {
  await using context = setupTest();

  await context.store.writeDocument({
    id: 'a',
    tool: 'fob',
    schemaVersion: 1,
    name: 'Kept',
    updatedAt: '2026-09-25T10:00:00.000Z',
    data: null,
  });

  await context.store.close();

  const document = await context.store.readDocument('a');

  expect(document?.name).toBe('Kept');
});
