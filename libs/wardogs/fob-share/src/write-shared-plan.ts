import { decodePlan } from '@wardogs-love/fob';
import type { Kysely } from 'kysely';
import type { ShareSchema } from './types';

// a share code for a few thousand pieces fits well inside this, and the cap bounds what one request
// can inflate on the server
const MAX_CODE_LENGTH = 32_000;
const MIN_SHARE_ID_LENGTH = 8;

// stores a share code under an id cut from its hash, so one plan always gets the same link; the code
// must decode to a valid plan, and a clash with another code takes a longer cut of the hash
export async function writeSharedPlan(
  database: Kysely<ShareSchema>,
  code: string,
): Promise<string> {
  if (code.length > MAX_CODE_LENGTH) {
    throw new Error(`the share code is longer than ${MAX_CODE_LENGTH} characters`);
  }

  await decodePlan(code);

  const digest = new Bun.CryptoHasher('sha256').update(code).digest('base64url');

  const shareIDs = Array.from({ length: digest.length - MIN_SHARE_ID_LENGTH + 1 }, (_, index) =>
    digest.slice(0, MIN_SHARE_ID_LENGTH + index),
  );

  return writeUnderFirstFreeID(database, code, shareIDs);
}

async function writeUnderFirstFreeID(
  database: Kysely<ShareSchema>,
  code: string,
  shareIDs: readonly string[],
): Promise<string> {
  const [shareID, ...rest] = shareIDs;

  if (shareID === undefined) {
    throw new Error('every share id for this code is taken');
  }

  await database
    .insertInto('sharedPlans')
    .values({ shareID, code })
    .onConflict((conflict) => conflict.doNothing())
    .execute();

  const stored = await database
    .selectFrom('sharedPlans')
    .select('code')
    .where('shareID', '=', shareID)
    .executeTakeFirstOrThrow();

  return stored.code === code ? shareID : writeUnderFirstFreeID(database, code, rest);
}
