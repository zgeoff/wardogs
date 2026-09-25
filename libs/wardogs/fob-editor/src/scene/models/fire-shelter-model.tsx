import { ModelBox } from './model-box';
import type { PieceModelProps } from './types';

const CELL = 1.5;
const WALL_HEIGHT = 3;
const ROOF = 0.12;

// the indirect fire shelter: a ring of tall hesco with a doorway in each side, a steel roof, and
// a three-by-three layer of hesco on the roof
export function FireShelterModel(props: PieceModelProps) {
  const size = props.size;
  const segment = (size.width - CELL) / 2;
  const offset = CELL / 2 + segment / 2;
  const edgeX = size.width / 2 - CELL / 2;
  const edgeZ = size.depth / 2 - CELL / 2;
  const capHeight = size.height - WALL_HEIGHT - ROOF;
  const capSize = 3 * CELL;
  const seams = [-CELL / 2, CELL / 2];

  return (
    <group>
      {[-offset, offset].flatMap((along) => [
        <ModelBox
          centre={[along, WALL_HEIGHT / 2, -edgeZ]}
          key={`a${along}`}
          opacity={props.opacity}
          size={[segment, WALL_HEIGHT, CELL]}
          tone="hesco"
        />,
        <ModelBox
          centre={[along, WALL_HEIGHT / 2, edgeZ]}
          key={`b${along}`}
          opacity={props.opacity}
          size={[segment, WALL_HEIGHT, CELL]}
          tone="hesco"
        />,
        <ModelBox
          centre={[-edgeX, WALL_HEIGHT / 2, along]}
          key={`c${along}`}
          opacity={props.opacity}
          size={[CELL, WALL_HEIGHT, segment]}
          tone="hesco"
        />,
        <ModelBox
          centre={[edgeX, WALL_HEIGHT / 2, along]}
          key={`d${along}`}
          opacity={props.opacity}
          size={[CELL, WALL_HEIGHT, segment]}
          tone="hesco"
        />,
      ])}
      <ModelBox
        centre={[0, WALL_HEIGHT + ROOF / 2, 0]}
        opacity={props.opacity}
        size={[size.width, ROOF, size.depth]}
        tone="steel"
      />
      <ModelBox
        centre={[0, WALL_HEIGHT + ROOF + capHeight / 2, 0]}
        opacity={props.opacity}
        size={[capSize - 0.06, capHeight, capSize - 0.06]}
        tone="hesco"
      />
      {seams.flatMap((seam) => [
        <ModelBox
          centre={[seam, WALL_HEIGHT + ROOF + capHeight / 2, 0]}
          key={`x${seam}`}
          opacity={props.opacity}
          size={[0.05, capHeight + 0.01, capSize]}
          tone="hescoFrame"
        />,
        <ModelBox
          centre={[0, WALL_HEIGHT + ROOF + capHeight / 2, seam]}
          key={`z${seam}`}
          opacity={props.opacity}
          size={[capSize, capHeight + 0.01, 0.05]}
          tone="hescoFrame"
        />,
      ])}
    </group>
  );
}
