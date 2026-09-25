import { CatmullRomCurve3, TubeGeometry, Vector3 } from 'three';

interface CoilShape {
  readonly length: number;
  readonly radius: number;
  readonly turns: number;
}

const POINTS_PER_TURN = 10;
const WIRE_RADIUS = 0.012;

// a coil of razor wire along z, centred on the origin
export function buildCoilGeometry(shape: CoilShape): TubeGeometry {
  const count = shape.turns * POINTS_PER_TURN;

  const points = Array.from({ length: count + 1 }, (_, index) => {
    const angle = (index / POINTS_PER_TURN) * Math.PI * 2;

    return new Vector3(
      Math.cos(angle) * shape.radius,
      Math.sin(angle) * shape.radius,
      (index / count - 0.5) * shape.length,
    );
  });

  return new TubeGeometry(new CatmullRomCurve3(points), count * 2, WIRE_RADIUS, 3, false);
}
