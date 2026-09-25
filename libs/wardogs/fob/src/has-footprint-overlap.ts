import { hasBoxOverlap } from './has-box-overlap';
import type { Box } from './types';

// overlap seen from above: the two boxes stretched to the same infinite height
export function hasFootprintOverlap(a: Box, b: Box): boolean {
  return hasBoxOverlap(
    { min: { ...a.min, y: 0 }, max: { ...a.max, y: 1 } },
    { min: { ...b.min, y: 0 }, max: { ...b.max, y: 1 } },
  );
}
