import { expect, test } from 'bun:test';
import { createShareDatabase } from './create-share-database';
import { findSharedPlanCode } from './find-shared-plan-code';

async function setupTest() {
  const database = await createShareDatabase(':memory:');

  return {
    database,
    async [Symbol.asyncDispose]() {
      await database.destroy();
    },
  };
}

test('it finds nothing under an id nobody created', async () => {
  await using share = await setupTest();

  const code = await findSharedPlanCode(share.database, 'AbCd1234');

  expect(code).toBeUndefined();
});
