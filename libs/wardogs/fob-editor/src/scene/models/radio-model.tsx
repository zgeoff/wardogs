import { ModelBox } from './model-box';
import { ModelCylinder } from './model-cylinder';
import type { PieceModelProps } from './types';

const DECK = 0.4;
const TABLE = 0.85;

// the builder's radio: a field radio on a folding table over supply crates, on a timber platform
// with sandbags along one side
export function RadioModel(props: PieceModelProps) {
  const size = props.size;
  const tableTop = DECK + TABLE;
  const legX = 0.15 + 0.45;
  const legZ = 1.1;

  return (
    <group>
      <ModelBox
        centre={[0, DECK / 2, 0]}
        opacity={props.opacity}
        size={[size.width, DECK, size.depth]}
        tone="wood"
      />
      <ModelBox
        centre={[-(size.width / 2 - 0.18), DECK + 0.28, 0]}
        opacity={props.opacity}
        size={[0.36, 0.55, size.depth]}
        tone="sandbag"
      />
      <ModelBox
        centre={[0.15, tableTop, 0]}
        opacity={props.opacity}
        size={[1, 0.05, 2.4]}
        tone="drab"
      />
      {[0.15 - 0.45, legX].flatMap((x) =>
        [-legZ, legZ].map((z) => (
          <ModelBox
            centre={[x, DECK + TABLE / 2, z]}
            key={`${x}:${z}`}
            opacity={props.opacity}
            size={[0.04, TABLE, 0.04]}
            tone="steel"
          />
        )),
      )}
      <ModelBox
        centre={[0.15, DECK + 0.23, 0.2]}
        opacity={props.opacity}
        size={[0.7, 0.45, 1.6]}
        tone="crate"
      />
      <ModelBox
        centre={[0.2, tableTop + 0.2, -0.4]}
        opacity={props.opacity}
        size={[0.3, 0.35, 0.6]}
        tone="rubber"
      />
      <ModelCylinder
        centre={[0.2, tableTop + 0.4, -0.6]}
        length={size.height - tableTop - 0.2}
        opacity={props.opacity}
        radius={0.01}
        sides={4}
        tone="rubber"
      />
    </group>
  );
}
