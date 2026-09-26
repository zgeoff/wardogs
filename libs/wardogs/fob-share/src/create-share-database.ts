import { Kysely } from 'kysely';
import { BunSqliteDialect } from 'kysely-bun-worker/normal';
import { Migrator } from 'kysely/migration';
import { migrations } from './migrations';
import type { ShareSchema } from './types';

// opens the SQLite share database at a file path, or ':memory:', and migrates it to the latest
// schema
export async function createShareDatabase(url: string): Promise<Kysely<ShareSchema>> {
  const database = new Kysely<ShareSchema>({ dialect: new BunSqliteDialect({ url }) });

  const migrator = new Migrator({
    db: database,
    provider: { getMigrations: () => Promise.resolve(migrations) },
  });

  const result = await migrator.migrateToLatest();

  if (result.error !== undefined) {
    await database.destroy();

    throw new Error('the share database failed to migrate', { cause: result.error });
  }

  return database;
}
