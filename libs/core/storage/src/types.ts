// a saved piece of work from one tool; `data` is the tool's own format at `schemaVersion`, which
// the tool validates and migrates on load
export interface StoredDocument {
  readonly id: string;
  readonly tool: string;
  readonly schemaVersion: number;
  readonly name: string;
  readonly updatedAt: string;
  readonly data: unknown;
}

export type DocumentSummary = Omit<StoredDocument, 'data'>;

export interface DocumentStore {
  readonly readDocuments: (tool: string) => Promise<DocumentSummary[]>;
  readonly readDocument: (id: string) => Promise<StoredDocument | undefined>;
  readonly writeDocument: (document: StoredDocument) => Promise<void>;
  readonly removeDocument: (id: string) => Promise<void>;
  readonly close: () => Promise<void>;
}
