import { expect, test } from 'bun:test';
import { buildPlanDocument } from './build-plan-document';

test('it wraps a plan as a versioned FOB document', () => {
  const document = buildPlanDocument({
    id: 'd',
    name: 'North ridge',
    plan: { stageCount: 1, pieces: [] },
    updatedAt: new Date('2026-09-25T10:00:00.000Z'),
  });

  expect(document).toStrictEqual({
    id: 'd',
    tool: 'fob',
    schemaVersion: 1,
    name: 'North ridge',
    updatedAt: '2026-09-25T10:00:00.000Z',
    data: { stageCount: 1, pieces: [] },
  });
});
