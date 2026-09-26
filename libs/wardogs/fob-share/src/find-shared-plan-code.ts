import type { Kysely } from 'kysely';
import type { ShareSchema } from './types';

// the share code stored under a share id, or undefined for an id nobody created
export async function findSharedPlanCode(
  database: Kysely<ShareSchema>,
  shareID: string,
): Promise<string | undefined> {
  const row = await database
    .selectFrom('sharedPlans')
    .select('code')
    .where('shareID', '=', shareID)
    .executeTakeFirst();

  return row?.code;
}
