import { expect, test } from 'bun:test';
import { pieceSchema } from './piece-schema';

test('it accepts a complete piece', () => {
  const result = pieceSchema.safeParse({
    id: 'hesco-small',
    name: 'Hesco Block (Small)',
    category: 'hesco',
    size: { width: 1.5, height: 1.5, depth: 1.5 },
    supplies: 13,
    hitPoints: 1600,
    c4ToDestroy: 2,
    needsFOB: true,
    source: { gameVersion: 'early access 0.1', reference: 'in game', verifiedInGame: true },
  });

  expect(result.success).toBeTrue();
});

test('it rejects a piece with a zero-width collision box', () => {
  const result = pieceSchema.safeParse({
    id: 'hesco-small',
    name: 'Hesco Block (Small)',
    category: 'hesco',
    size: { width: 0, height: 1.5, depth: 1.5 },
    supplies: 13,
    hitPoints: 1600,
    c4ToDestroy: 2,
    needsFOB: true,
    source: { gameVersion: 'early access 0.1', reference: 'in game', verifiedInGame: true },
  });

  expect(result.success).toBeFalse();
});

test('it rejects an id with capital letters', () => {
  const result = pieceSchema.safeParse({
    id: 'HescoSmall',
    name: 'Hesco Block (Small)',
    category: 'hesco',
    size: { width: 1.5, height: 1.5, depth: 1.5 },
    supplies: 13,
    hitPoints: 1600,
    c4ToDestroy: 2,
    needsFOB: true,
    source: { gameVersion: 'early access 0.1', reference: 'in game', verifiedInGame: true },
  });

  expect(result.success).toBeFalse();
});

test('it rejects an unknown category', () => {
  const result = pieceSchema.safeParse({
    id: 'hesco-small',
    name: 'Hesco Block (Small)',
    category: 'vehicles',
    size: { width: 1.5, height: 1.5, depth: 1.5 },
    supplies: 13,
    hitPoints: 1600,
    c4ToDestroy: 2,
    needsFOB: true,
    source: { gameVersion: 'early access 0.1', reference: 'in game', verifiedInGame: true },
  });

  expect(result.success).toBeFalse();
});
