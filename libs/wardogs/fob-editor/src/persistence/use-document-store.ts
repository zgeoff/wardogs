import { createIndexedDBDocumentStore } from '@wardogs-love/storage';
import type { DocumentStore } from '@wardogs-love/storage';

const DATABASE_NAME = 'wardogs-love';
let documentStore: DocumentStore | null = null;

// the browser's document store, opened on first use and shared by every part of the planner
export function useDocumentStore(): DocumentStore {
  documentStore ??= createIndexedDBDocumentStore(DATABASE_NAME);

  return documentStore;
}
