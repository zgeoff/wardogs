import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createShareDatabase } from '@wardogs-love/fob-share';
import type { ShareSchema } from '@wardogs-love/fob-share';
import type { Kysely } from 'kysely';

// DATABASE_PATH names the SQLite file; Fly mounts a volume for it, and ':memory:' keeps the e2e run
// off the disk
const databasePath = process.env['DATABASE_PATH'] ?? '.data/wardogs.db';
let opening: Promise<Kysely<ShareSchema>> | null = null;

// the server's one share database, opened and migrated on first use
export function getShareDatabase(): Promise<Kysely<ShareSchema>> {
  if (opening === null) {
    if (databasePath !== ':memory:') {
      mkdirSync(dirname(databasePath), { recursive: true });
    }

    opening = createShareDatabase(databasePath);
  }

  return opening;
}
