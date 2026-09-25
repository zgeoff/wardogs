import { expect, test } from 'bun:test';
import { parsePlanDocument } from './parse-plan-document';

test('it reads the plan from a valid FOB document', () => {
  const result = parsePlanDocument({
    id: 'd',
    tool: 'fob',
    schemaVersion: 1,
    name: 'Plan',
    updatedAt: '2026-09-25T10:00:00.000Z',
    data: {
      stageCount: 1,
      pieces: [{ id: 'a', pieceID: 'gate', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
    },
  });

  expect(result).toStrictEqual({
    ok: true,
    plan: {
      stageCount: 1,
      pieces: [{ id: 'a', pieceID: 'gate', x: 0, z: 0, elevation: 0, rotation: 0, stage: 1 }],
    },
  });
});

test('it rejects a document from another tool', () => {
  const result = parsePlanDocument({
    id: 'd',
    tool: 'loadout',
    schemaVersion: 1,
    name: 'Plan',
    updatedAt: '2026-09-25T10:00:00.000Z',
    data: { stageCount: 1, pieces: [] },
  });

  expect(result).toStrictEqual({ ok: false, reason: 'this is a loadout document, not a FOB plan' });
});

test('it rejects a document from a newer schema', () => {
  const result = parsePlanDocument({
    id: 'd',
    tool: 'fob',
    schemaVersion: 99,
    name: 'Plan',
    updatedAt: '2026-09-25T10:00:00.000Z',
    data: { stageCount: 1, pieces: [] },
  });

  expect(result).toStrictEqual({
    ok: false,
    reason: 'this plan comes from a newer version of the planner',
  });
});

test('it rejects a document whose plan fails validation', () => {
  const result = parsePlanDocument({
    id: 'd',
    tool: 'fob',
    schemaVersion: 1,
    name: 'Plan',
    updatedAt: '2026-09-25T10:00:00.000Z',
    data: { stageCount: 0, pieces: 'none' },
  });

  expect(result).toStrictEqual({ ok: false, reason: 'the plan data is damaged' });
});
