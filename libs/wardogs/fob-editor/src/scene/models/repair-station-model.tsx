import { TorusGeometry } from 'three';
import { ModelBox } from './model-box';
import { ModelShape } from './model-shape';
import type { PieceModelProps } from './types';

const DECK = 0.45;
const TYRE = 0.12;

const tyre = new TorusGeometry(0.3, TYRE, 6, 16).rotateX(Math.PI / 2);

// a timber workshop deck: a workbench along the back, a tool cabinet, a stack of tyres in one corner,
// and sandbags along one side
export function RepairStationModel(props: PieceModelProps) {
  const size = props.size;
  const top = size.height - DECK;

  return (
    <group>
      <ModelBox
        centre={[0, DECK / 2, 0]}
        opacity={props.opacity}
        size={[size.width, DECK, size.depth]}
        tone="wood"
      />
      <ModelBox
        centre={[-0.3, DECK + 0.35, -1.2]}
        opacity={props.opacity}
        size={[2.2, 0.7, 0.55]}
        tone="woodDark"
      />
      <ModelBox
        centre={[-0.4, DECK + 0.3, 0.6]}
        opacity={props.opacity}
        size={[0.9, 0.6, 0.5]}
        tone="rubber"
      />
      {[0, 1, 2].map((layer) => (
        <ModelShape
          centre={[1.1, DECK + TYRE + layer * 2 * TYRE, -1.1]}
          geometry={tyre}
          key={layer}
          opacity={props.opacity}
          tone="rubber"
        />
      ))}
      <ModelBox
        centre={[-(size.width / 2 - 0.18), DECK + top / 4, 0.5]}
        opacity={props.opacity}
        size={[0.36, top / 2, 1.8]}
        tone="sandbag"
      />
      <ModelBox
        centre={[0.9, DECK + 0.2, 0.9]}
        opacity={props.opacity}
        size={[0.5, 0.4, 0.4]}
        tone="crate"
      />
    </group>
  );
}
