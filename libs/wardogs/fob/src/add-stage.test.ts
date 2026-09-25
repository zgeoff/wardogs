import { expect, test } from 'bun:test';
import { addStage } from './add-stage';

test('it adds an empty stage at the end', () => {
  expect(addStage({ stageCount: 2, pieces: [] })).toStrictEqual({ stageCount: 3, pieces: [] });
});
