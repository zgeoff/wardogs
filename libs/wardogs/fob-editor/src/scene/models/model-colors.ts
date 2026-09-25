// the palette the piece models draw from; like the category colours, plain strings for three.js
export const modelColors = {
  hesco: '#a38c66',
  hescoFill: '#8c7654',
  hescoFrame: '#5d594c',
  hescoDark: '#8a7555',
  wood: '#7a5c3e',
  woodDark: '#5a432d',
  steel: '#50555a',
  concrete: '#8e8c85',
  netting: '#566140',
  nettingDark: '#434c32',
  sandbag: '#a0916a',
  sandbagDark: '#8a7c58',
  drab: '#4b5339',
  crate: '#6b6f5a',
  accent: '#f5b04a',
  sheet: '#9b8a66',
  tank: '#3c4a3b',
  rubber: '#262829',
  brass: '#8a6a3c',
  grey: '#767b80',
  greyDark: '#5b6065',
} as const;

export type ModelTone = keyof typeof modelColors;
