import { ModelBox } from './model-box';
import type { PieceModelProps } from './types';

const CELL_LENGTH = 1.5;
const LIP_HEIGHT = 0.08;
const CAP_HEIGHT = 0.05;

// a run of tall hesco cells along the wall's depth: one body, with a wire seam between cells
export function HescoWall(props: PieceModelProps) {
  const size = props.size;
  const bodyHeight = size.height - CAP_HEIGHT;
  const seamCount = Math.round(size.depth / CELL_LENGTH) - 1;

  const seams = Array.from(
    { length: seamCount },
    (_, index) => (index + 1) * CELL_LENGTH - size.depth / 2,
  );

  return (
    <group>
      <ModelBox
        centre={[0, LIP_HEIGHT / 2, 0]}
        opacity={props.opacity}
        size={[size.width, LIP_HEIGHT, size.depth]}
        tone="hescoFrame"
      />
      <ModelBox
        centre={[0, bodyHeight / 2, 0]}
        opacity={props.opacity}
        size={[size.width - 0.06, bodyHeight, size.depth - 0.06]}
        tone="hesco"
      />
      <ModelBox
        centre={[0, bodyHeight + CAP_HEIGHT / 2, 0]}
        opacity={props.opacity}
        size={[size.width - 0.16, CAP_HEIGHT, size.depth - 0.16]}
        tone="hescoFill"
      />
      {seams.map((z) => (
        <ModelBox
          centre={[0, size.height / 2, z]}
          key={z}
          opacity={props.opacity}
          size={[size.width + 0.01, size.height, 0.05]}
          tone="hescoFrame"
        />
      ))}
    </group>
  );
}
