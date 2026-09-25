import type { DBSchema, IDBPDatabase } from 'idb';
import { openDB } from 'idb';
import type { DocumentStore, DocumentSummary, StoredDocument } from './types';

export function createIndexedDBDocumentStore(databaseName: string): DocumentStore {
  return new IndexedDBDocumentStore(databaseName);
}

interface DocumentDB extends DBSchema {
  documents: {
    key: string;
    value: StoredDocument;
    indexes: { 'by-tool': string };
  };
}

type Connection = Promise<IDBPDatabase<DocumentDB>>;

const DB_VERSION = 1;

// the connection opens on first use; one that failed to open, closed for another tab's upgrade, or
// was terminated by the browser is dropped, so the next call opens afresh
class IndexedDBDocumentStore implements DocumentStore {
  private readonly databaseName: string;

  private connection: Connection | null = null;

  public constructor(databaseName: string) {
    this.databaseName = databaseName;
  }

  public readonly readDocuments = async (tool: string): Promise<DocumentSummary[]> => {
    const database = await this.resolveConnection();
    const documents = await database.getAllFromIndex('documents', 'by-tool', tool);

    return documents
      .map((document) => toSummary(document))
      .toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  };

  public readonly readDocument = async (id: string): Promise<StoredDocument | undefined> => {
    const database = await this.resolveConnection();

    return database.get('documents', id);
  };

  public readonly writeDocument = async (document: StoredDocument): Promise<void> => {
    const database = await this.resolveConnection();

    await database.put('documents', document);
  };

  public readonly removeDocument = async (id: string): Promise<void> => {
    const database = await this.resolveConnection();

    await database.delete('documents', id);
  };

  public readonly close = async (): Promise<void> => {
    const current = this.connection;

    this.connection = null;

    if (current !== null) {
      await stopConnection(current);
    }
  };

  private resolveConnection(): Connection {
    if (this.connection !== null) {
      return this.connection;
    }

    const opened = openDB<DocumentDB>(this.databaseName, DB_VERSION, {
      upgrade: (database) => {
        database.createObjectStore('documents', { keyPath: 'id' }).createIndex('by-tool', 'tool');
      },
      blocking: () => {
        this.resetConnection(opened);
        void stopConnection(opened);
      },
      terminated: () => {
        this.resetConnection(opened);
      },
    });

    this.connection = opened;
    void this.resetConnectionOnFailure(opened);

    return opened;
  }

  private resetConnection(opened: Readonly<Connection>): void {
    if (this.connection === opened) {
      this.connection = null;
    }
  }

  private async resetConnectionOnFailure(opened: Readonly<Connection>): Promise<void> {
    try {
      await opened;
    } catch {
      this.resetConnection(opened);
    }
  }
}

async function stopConnection(opened: Readonly<Connection>): Promise<void> {
  const database = await opened;

  database.close();
}

function toSummary(document: StoredDocument): DocumentSummary {
  return {
    id: document.id,
    tool: document.tool,
    schemaVersion: document.schemaVersion,
    name: document.name,
    updatedAt: document.updatedAt,
  };
}
