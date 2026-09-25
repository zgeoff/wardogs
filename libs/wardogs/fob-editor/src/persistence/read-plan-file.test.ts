import { expect, test } from 'bun:test';
import { readPlanFile } from './read-plan-file';

test('it reads the name and plan from an exported file', async () => {
  const file = new Blob([
    JSON.stringify({
      id: 'd',
      tool: 'fob',
      schemaVersion: 1,
      name: 'North ridge',
      updatedAt: '2026-09-25T10:00:00.000Z',
      data: { stageCount: 1, pieces: [] },
    }),
  ]);

  const result = await readPlanFile(file);

  expect(result).toStrictEqual({
    ok: true,
    name: 'North ridge',
    plan: { stageCount: 1, pieces: [] },
  });
});

test('it rejects a file that is not JSON', async () => {
  const result = await readPlanFile(new Blob(['not json']));

  expect(result).toStrictEqual({ ok: false, reason: 'the file is not JSON' });
});

test('it rejects JSON that is not a saved plan', async () => {
  const result = await readPlanFile(new Blob([JSON.stringify({ hello: 'world' })]));

  expect(result).toStrictEqual({ ok: false, reason: 'the file is not a saved plan' });
});
