import { BufferGeometry, Float32BufferAttribute } from 'three';

interface TrussShape {
  readonly width: number;
  readonly height: number;
  readonly bays: number;
}

// the line segments of a square lattice tower rising from the origin: four legs, a ring at every
// bay, and a cross brace on each face of each bay
export function buildTrussGeometry(shape: TrussShape): BufferGeometry {
  const half = shape.width / 2;
  const bay = shape.height / shape.bays;

  const corners = [
    [-half, -half],
    [half, -half],
    [half, half],
    [-half, half],
  ] as const;

  const segments = Array.from({ length: shape.bays }, (_, index) => {
    const low = index * bay;
    const high = low + bay;

    return corners.flatMap(([x, z], corner) => {
      const [nextX, nextZ] = corners[(corner + 1) % corners.length] ?? corners[0];

      return [
        [x, low, z, x, high, z],
        [x, high, z, nextX, high, nextZ],
        [x, low, z, nextX, high, nextZ],
        [nextX, low, nextZ, x, high, z],
      ];
    });
  }).flat(2);

  return new BufferGeometry().setAttribute('position', new Float32BufferAttribute(segments, 3));
}
