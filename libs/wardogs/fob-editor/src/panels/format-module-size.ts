import type { Piece } from '@wardogs-love/game-data';

const MODULE = 1.5;

// a footprint in the game's 1.5 m building modules, as players count it: "1×4"
export function formatModuleSize(piece: Piece): string {
  return `${formatModules(piece.size.width)}×${formatModules(piece.size.depth)}`;
}

function formatModules(metres: number): string {
  const modules = metres / MODULE;

  return Number.isInteger(modules) ? String(modules) : modules.toFixed(1);
}
