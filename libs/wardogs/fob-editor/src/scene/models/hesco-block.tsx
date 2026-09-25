import { ModelBox } from './model-box';
import type { PieceModelProps } from './types';

const LIP_HEIGHT = 0.08;
const CAP_HEIGHT = 0.05;

// a filled hesco cage: the fabric body, the wire lip it stands on, and the fill showing at its top
export function HescoBlock(props: PieceModelProps) {
  const size = props.size;
  const bodyHeight = size.height - CAP_HEIGHT;

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
    </group>
  );
}
