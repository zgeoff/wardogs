import { buildCoilGeometry } from './build-coil-geometry';
import { ModelBox } from './model-box';
import { ModelShape } from './model-shape';
import type { PieceModelProps } from './types';

const LEAF_HEIGHT = 3;
const coil = buildCoilGeometry({ length: 5.7, radius: 0.32, turns: 28 });

// a two-leaf baby-blue steel gate across the piece's depth, with razor wire strung on posts above it
export function GateModel(props: PieceModelProps) {
  const size = props.size;
  const postZ = [-(size.depth / 2 - 0.1), 0, size.depth / 2 - 0.1];

  return (
    <group>
      <ModelBox
        centre={[0, LEAF_HEIGHT / 2, 0]}
        opacity={props.opacity}
        size={[0.2, LEAF_HEIGHT, size.depth - 0.1]}
        tone="gateBlue"
      />
      <ModelBox
        centre={[0, LEAF_HEIGHT / 2, 0]}
        opacity={props.opacity}
        size={[0.24, LEAF_HEIGHT, 0.08]}
        tone="gateBlueDark"
      />
      {postZ.map((z) => (
        <ModelBox
          centre={[0, (size.height - 0.1) / 2, z]}
          key={z}
          opacity={props.opacity}
          size={[0.1, size.height - 0.1, 0.1]}
          tone="steel"
        />
      ))}
      <ModelShape
        centre={[0, LEAF_HEIGHT + 0.7, 0]}
        geometry={coil}
        opacity={props.opacity}
        tone="steel"
      />
    </group>
  );
}
