import { buildCoilGeometry } from './build-coil-geometry';
import { ModelBox } from './model-box';
import { ModelShape } from './model-shape';
import type { PieceModelProps } from './types';

const POST = 0.07;
const COIL_RADIUS = 0.33;
const coil = buildCoilGeometry({ length: 2.8, radius: COIL_RADIUS, turns: 24 });

// two coils of razor wire stacked along the piece's depth, held by a braced post frame at each end
export function BarbedWireModel(props: PieceModelProps) {
  const size = props.size;
  const postX = size.width / 2 - 0.13;
  const postZ = size.depth / 2 - 0.06;
  const braceLength = Math.hypot(2 * postX, size.height - 0.2);
  const braceAngle = -Math.atan2(2 * postX, size.height - 0.2);

  return (
    <group>
      {[-postX, postX].flatMap((x) =>
        [-postZ, postZ].map((z) => (
          <ModelBox
            centre={[x, size.height / 2, z]}
            key={`${x}:${z}`}
            opacity={props.opacity}
            size={[POST, size.height, POST]}
            tone="steel"
          />
        )),
      )}
      {[-postZ, postZ].map((z) => (
        <ModelBox
          centre={[0, size.height / 2, z]}
          key={z}
          opacity={props.opacity}
          rotation={[0, 0, braceAngle]}
          size={[0.04, braceLength, 0.04]}
          tone="steel"
        />
      ))}
      {[COIL_RADIUS + 0.03, size.height - COIL_RADIUS - 0.05].map((y) => (
        <ModelShape
          centre={[0, y, 0]}
          geometry={coil}
          key={y}
          opacity={props.opacity}
          tone="steel"
        />
      ))}
    </group>
  );
}
