import { expect, test } from 'bun:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createShareDatabase } from './create-share-database';

async function setupTest() {
  const dir = await mkdtemp(join(tmpdir(), 'fob-share-'));

  return {
    dir,
    async [Symbol.asyncDispose]() {
      await rm(dir, { recursive: true, force: true });
    },
  };
}

test('it keeps stored plans when a file database opens again', async () => {
  await using project = await setupTest();

  const url = join(project.dir, 'share.db');

  const first = await createShareDatabase(url);

  await first.insertInto('sharedPlans').values({ shareID: 'AbCd1234', code: '1.x' }).execute();
  await first.destroy();

  const second = await createShareDatabase(url);
  const rows = await second.selectFrom('sharedPlans').select(['shareID', 'code']).execute();

  await second.destroy();

  expect(rows).toStrictEqual([{ shareID: 'AbCd1234', code: '1.x' }]);
});
