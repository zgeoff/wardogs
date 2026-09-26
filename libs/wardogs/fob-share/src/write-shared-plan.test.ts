import { expect, test } from 'bun:test';
import { encodePlan } from '@wardogs-love/fob';
import { createShareDatabase } from './create-share-database';
import { findSharedPlanCode } from './find-shared-plan-code';
import { writeSharedPlan } from './write-shared-plan';

async function setupTest() {
  const database = await createShareDatabase(':memory:');

  return {
    database,
    async [Symbol.asyncDispose]() {
      await database.destroy();
    },
  };
}

test('it stores a share code under an 8-character URL-safe id', async () => {
  await using share = await setupTest();

  const code = await encodePlan({
    stageCount: 1,
    pieces: [{ id: 'a', pieceID: 'gate', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
  });

  const shareID = await writeSharedPlan(share.database, code);
  const stored = await findSharedPlanCode(share.database, shareID);

  expect(shareID).toMatch(/^[\w-]{8}$/u);
  expect(stored).toBe(code);
});

test('it gives the same plan the same id every time', async () => {
  await using share = await setupTest();

  const code = await encodePlan({
    stageCount: 2,
    pieces: [{ id: 'a', pieceID: 'hesco-wall', x: 4, z: -2, elevation: 0, rotation: 1, stage: 2 }],
  });

  const first = await writeSharedPlan(share.database, code);
  const second = await writeSharedPlan(share.database, code);

  expect(second).toBe(first);
});

test('it takes a longer id when another code holds the short one', async () => {
  await using share = await setupTest();

  const code = await encodePlan({
    stageCount: 1,
    pieces: [{ id: 'a', pieceID: 'gate', x: 2, z: 2, elevation: 0, rotation: 0, stage: 1 }],
  });

  const digest = new Bun.CryptoHasher('sha256').update(code).digest('base64url');

  await share.database
    .insertInto('sharedPlans')
    .values({ shareID: digest.slice(0, 8), code: '1.other' })
    .execute();

  const shareID = await writeSharedPlan(share.database, code);

  expect(shareID).toBe(digest.slice(0, 9));
});

test('it rejects a code that does not decode to a plan', async () => {
  await using share = await setupTest();

  await expect(writeSharedPlan(share.database, '1.not-a-plan')).toReject();
});

test('it rejects a code longer than 32000 characters', async () => {
  await using share = await setupTest();

  expect(writeSharedPlan(share.database, `1.${'a'.repeat(32_000)}`)).rejects.toThrowWithMessage(
    Error,
    /longer than 32000 characters/u,
  );
});
