import type { PieceCategory } from '@wardogs-love/game-data';

// scene colours live here, not in Panda tokens: three.js materials take plain colour strings
export const categoryColors: Readonly<Record<PieceCategory, string>> = {
  command: '#f5b04a',
  hesco: '#b8a074',
  bunkers: '#7f8c5a',
  barriers: '#9c9b8f',
  recon: '#6e917b',
  defences: '#b8664b',
  support: '#6283a0',
};

export const sceneColors = {
  background: '#10110d',
  gridCell: '#24251f',
  gridSection: '#383a2f',
  fobArea: '#f5b04a',
  selected: '#ffc978',
  invalid: '#e5584f',
  outsideArea: '#e8c547',
  footprint: '#8d8872',
  boxSelect: '#f5b04a',
} as const;
