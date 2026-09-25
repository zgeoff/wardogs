import type { CellOffset } from './types';

// the grid steps on a straight line from one step to another, leaving out the first and keeping
// the last, so a pointer that jumps several steps between two moves leaves no gap
export function collectStrideCells(from: CellOffset, to: CellOffset): readonly CellOffset[] {
  const count = Math.max(Math.abs(to.x - from.x), Math.abs(to.z - from.z));

  return Array.from({ length: count }, (_, index) => {
    const along = (index + 1) / count;

    return {
      x: Math.round(from.x + (to.x - from.x) * along),
      z: Math.round(from.z + (to.z - from.z) * along),
    };
  });
}
