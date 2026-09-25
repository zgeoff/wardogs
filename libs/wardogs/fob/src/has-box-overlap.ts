import type { Box } from './types';

// collision boxes come from measured meshes, so faces meant to touch can cross by a few millimetres
const OVERLAP_TOLERANCE = 0.01;

export function hasBoxOverlap(a: Box, b: Box): boolean {
  return hasAxisOverlap(a, b, 'x') && hasAxisOverlap(a, b, 'y') && hasAxisOverlap(a, b, 'z');
}

function hasAxisOverlap(a: Box, b: Box, axis: 'x' | 'y' | 'z'): boolean {
  return (
    Math.min(a.max[axis], b.max[axis]) - Math.max(a.min[axis], b.min[axis]) > OVERLAP_TOLERANCE
  );
}
