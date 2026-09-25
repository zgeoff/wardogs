import { ModelBox } from './model-box';
import type { PieceModelProps } from './types';

const DECK = 0.15;

// a plank roof with a camouflage net heaped over it
export function NetRoofModel(props: PieceModelProps) {
  const size = props.size;
  const netHeight = size.height - DECK;

  return (
    <group>
      <ModelBox
        centre={[0, DECK / 2, 0]}
        opacity={props.opacity}
        size={[size.width, DECK, size.depth]}
        tone="wood"
      />
      <ModelBox
        centre={[0, DECK + (netHeight * 0.6) / 2, 0]}
        opacity={props.opacity}
        size={[size.width - 0.1, netHeight * 0.6, size.depth - 0.1]}
        tone="netting"
      />
      <ModelBox
        centre={[0, DECK + netHeight * 0.8, 0]}
        opacity={props.opacity}
        size={[size.width - 1.2, netHeight * 0.4, size.depth - 1.2]}
        tone="netting"
      />
    </group>
  );
}
