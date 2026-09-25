import { ModelBox } from './model-box';
import type { PieceModelProps } from './types';

const PLATFORM = 0.2;
const MAST = 0.22;

// the FOB: a steel platform stacked with supply crates, a tall mast with a radar bar on top, and
// an amber flag to find it by
export function FOBModel(props: PieceModelProps) {
  const size = props.size;
  const mastX = size.width / 2 - 0.5;
  const mastZ = size.depth / 2 - 0.5;
  const mastHeight = size.height - PLATFORM - 0.1;

  return (
    <group>
      <ModelBox
        centre={[0, PLATFORM / 2, 0]}
        opacity={props.opacity}
        size={[size.width, PLATFORM, size.depth]}
        tone="steel"
      />
      <ModelBox
        centre={[-0.7, PLATFORM + 0.4, -0.7]}
        opacity={props.opacity}
        size={[1.3, 0.8, 1.1]}
        tone="drab"
      />
      <ModelBox
        centre={[-0.9, PLATFORM + 0.55, 0.8]}
        opacity={props.opacity}
        size={[0.9, 1.1, 0.9]}
        tone="crate"
      />
      <ModelBox
        centre={[0.6, PLATFORM + 0.3, -1]}
        opacity={props.opacity}
        size={[1, 0.6, 0.8]}
        tone="sandbag"
      />
      <ModelBox
        centre={[mastX, PLATFORM + mastHeight / 2, mastZ]}
        opacity={props.opacity}
        size={[MAST, mastHeight, MAST]}
        tone="steel"
      />
      <ModelBox
        centre={[mastX, size.height - 3.2, mastZ - 0.9]}
        opacity={props.opacity}
        size={[0.03, 1.2, 1.6]}
        tone="accent"
      />
      <ModelBox
        centre={[mastX - 0.3, size.height - 0.05, mastZ]}
        opacity={props.opacity}
        size={[1.2, 0.1, 0.25]}
        tone="steel"
      />
    </group>
  );
}
