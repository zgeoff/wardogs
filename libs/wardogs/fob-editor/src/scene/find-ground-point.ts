import type { GroundPoint } from '../state/types';

interface PointerRay {
  readonly origin: { readonly x: number; readonly y: number; readonly z: number };
  readonly direction: { readonly x: number; readonly y: number; readonly z: number };
}

// where a pointer ray meets the ground at y = 0, or null when the ray never reaches it; a press on a
// piece hits the piece's top or side, and only this point lines up with the ground under the cursor
export function findGroundPoint(ray: PointerRay): GroundPoint | null {
  if (ray.direction.y >= 0) {
    return null;
  }

  const distance = -ray.origin.y / ray.direction.y;

  if (distance < 0) {
    return null;
  }

  return {
    x: ray.origin.x + distance * ray.direction.x,
    z: ray.origin.z + distance * ray.direction.z,
  };
}
