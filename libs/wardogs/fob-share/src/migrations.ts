import { sql } from 'kysely';
import type { Kysely } from 'kysely';
import type { Migration } from 'kysely/migration';

// the share database's schema history; the Migrator runs these in key order, so a new migration takes
// the next number
export const migrations: Readonly<Record<string, Migration>> = {
  '0001-shared-plans': {
    async up(database: Kysely<unknown>) {
      await database.schema
        .createTable('sharedPlans')
        .addColumn('shareID', 'text', (column) => column.primaryKey())
        .addColumn('code', 'text', (column) => column.notNull())
        .addColumn('createdAt', 'text', (column) =>
          column.notNull().defaultTo(sql`current_timestamp`),
        )
        .execute();
    },
  },
};
