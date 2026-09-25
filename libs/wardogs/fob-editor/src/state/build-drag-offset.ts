import { CELL_SIZE } from '@wardogs-love/fob';
import type { CellOffset, GroundPoint } from './types';

// whole cells between where a drag started and where the pointer is now
export function buildDragOffset(start: GroundPoint, pointer: GroundPoint): CellOffset {
  return {
    x: Math.round((pointer.x - start.x) / CELL_SIZE) || 0,
    z: Math.round((pointer.z - start.z) / CELL_SIZE) || 0,
  };
}
